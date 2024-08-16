import { pool } from "@/lib/database";
import { authentication } from "../middleware";

export async function GET(req) {
  const { status, user, response } = await authentication(req);
  if (status !== 200) {
    return response;
  }
  const { id } = user;
  const url = new URL(req.url);
  const productId = url.searchParams.get("product_id");

  if (!productId) {
    return new Response(JSON.stringify({ message: "Product ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const [result] = await conn.execute(
      "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
      [id, productId]
    );

    if (result.affectedRows === 0) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const [cart] = await conn.query("SELECT * FROM cart WHERE user_id = ?", [
      id,
    ]);
    return new Response(JSON.stringify(cart), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    if (conn) conn.release();
  }
}
