import { pool } from "@/lib/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const passwordRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const generateMetadata = ({ params }) => {
  return {
    title: `Log-in`,
  };
};

export async function POST(request) {
  const data = await request.json();
  const { password, email } = data;

  if (!email || !password) {
    return new Response("Please fill all the fields", { status: 400 });
  }

  if (!passwordRegex.test(password)) {
    return new Response(
      JSON.stringify({
        message:
          "Password must be 8-20 characters long and contain at least one number, one uppercase letter, one lowercase letter, and one special character",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ message: "Invalid email address" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query("SELECT * FROM users WHERE email = ? ", [
      email,
    ]);
    const user = rows[0];
    if (rows.length < 1) {
      return new Response("Invalid email", { status: 401 });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return new Response("Invalid password", { status: 401 });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    const cookieOptions = {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    };
    return new Response(
      JSON.stringify({ message: "Login successful", token }),
      {
        status: 200,
        headers: {
          "Set-cookie": cookie.serialize("token", token, cookieOptions),
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Error connecting to database:", err);
    return new Response("Error connecting to database", { status: 500 });
  } finally {
    conn.release(); // 确保连接被释放
  }
}
