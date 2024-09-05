import { pool } from "@/lib/database";
import bcrypt from "bcrypt"; // 推荐使用 bcrypt 进行密码哈希
import { validateEmail, validatePassword } from "@/lib/validate";

const passwordRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  const data = await request.json();
  const { name, password, email } = data;

  if (!name || !password || !email) {
    return new Response(
      JSON.stringify({ message: "Missing required fields" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const validateEmailResult = validateEmail(email);
  if (validateEmailResult.status != 200) {
    return validateEmailResult;
  }
  const validatePasswordResult = validatePassword(password);
  if (validatePasswordResult.status != 200) {
    return validatePasswordResult;
  }

  const conn = await pool.getConnection();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const [exist] = await conn.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (exist.length > 0) {
      return new Response(JSON.stringify({ message: "Email already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const [result] = await conn.query(
      "INSERT INTO users(name, password, email) VALUES (?, ?, ?)",
      [name, hashedPassword, email]
    );

    if (result.affectedRows === 1) {
      return new Response(
        JSON.stringify({
          message: "Congratulations!🎊 We are directing to the Login page!",
        }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    } else {
      throw new Error("Error creating user");
    }
  } catch (error) {
    console.error("Error during database operation:", error);
    return new Response(
      JSON.stringify({ message: "Database error", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    conn.release(); // 确保连接被释放
  }
}
