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

    // Check if the product exists in the cart
    const [product] = await conn.query(
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
      [id, productId]
    );

    if (product.length === 0) {
      // Product does not exist in the cart
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const currentQuantity = product[0].quantity;

    if (currentQuantity > 1) {
      // If quantity is greater than 1, decrease it by 1
      await conn.execute(
        "UPDATE cart SET quantity = quantity - 1 WHERE user_id = ? AND product_id = ?",
        [id, productId]
      );
    } else {
      // If quantity is 1, delete the product from the cart
      await conn.execute(
        "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
        [id, productId]
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
