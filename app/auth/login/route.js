import { pool } from "@/lib/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { validateEmail, validatePassword } from "@/lib/validate";

export async function POST(request) {
  const data = await request.json();
  const { password, email } = data;

  if (!email || !password) {
    return new Response(
      JSON.stringify({ message: "Please fill all the fields" }),
      { status: 400 }
    );
  }
  // 调用 validateEmail，并处理返回结果
  const emailValidation = validateEmail(email);
  if (emailValidation.status !== 200) {
    return emailValidation; // 如果邮箱验证失败，返回错误响应
  }

  // 调用 validatePassword，并处理返回结果
  const passwordValidation = validatePassword(password);
  if (passwordValidation.status !== 200) {
    return passwordValidation; // 如果密码验证失败，返回错误响应
  }

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query("SELECT * FROM users WHERE email = ? ", [
      email,
    ]);
    const user = rows[0];
    if (rows.length < 1) {
      return new Response(JSON.stringify({ messgae: "email not found" }), {
        status: 401,
      });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return new Response(JSON.stringify({ messgae: "Invalid password" }), {
        status: 401,
      });
    }
    //jwt.sign(payload, secretOrPrivateKey, [options, callback])
    //签名
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    // 设置cookie
    const cookieOptions = {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    };
    return new Response(
      JSON.stringify({ message: "✨We are redirecting you to index!", token }),
      {
        status: 200,
        headers: {
          // cookie.serialize(name, value, options)
          "Set-cookie": cookie.serialize("token", token, cookieOptions),
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Error connecting to database" }),
      { status: 500 }
    );
  } finally {
    conn.release(); // 确保连接被释放
  }
}
