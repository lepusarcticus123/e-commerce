import { pool } from "@/lib/database";
import { authentication } from "../middleware";

export async function POST(req) {
  const { status, user, response } = await authentication(req);
  if (status !== 200) {
    return response;
  }
  const { id } = user;
  const data = await req.json();
  const { productId, productCategory } = data;

  if (!productId) {
    return new Response(JSON.stringify({ message: "Product ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    // Check if the product exists in the cart
    const [product] = await conn.query(
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
      [id, productId]
    );

    if (product.length > 0) {
      // If product exists, update the quantity
      await conn.execute(
        "UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?",
        [id, productId]
      );
    } else {
      // If product does not exist, insert it with quantity = 1
      await conn.execute(
        "INSERT INTO cart (user_id, product_id, quantity,category) VALUES (?, ?, ?, ?)",
        [id, productId, 1, productCategory]
      );
    }

    // Fetch the updated cart
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
