import { pool } from "@/lib/database";
import { authentication } from "../middleware";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { status, user } = await authentication(req);

  // 如果未登录，直接返回重定向响应
  if (status !== 200) {
    return user; // 这里的 user 实际上是 `NextResponse.redirect` 对象
  }

  const { id } = user; // 假设解码后的 token 包含 `id` 字段

  let conn; // 用于存储数据库连接

  try {
    conn = await pool.getConnection(); // 获取连接
    const [rows] = await conn.query("SELECT * FROM cart WHERE user_id = ?", [
      id,
    ]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ message: "Cart is empty" }), {
        status: 404,
      });
    } else {
      return new Response(JSON.stringify(rows), { status: 200 });
    }
  } catch (error) {
    console.error("Database query error:", error); // 添加错误日志以便调试
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
      { status: 500 }
    );
  } finally {
    if (conn) conn.release(); // 确保连接在所有情况下都被释放
  }
}
