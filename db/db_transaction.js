const { query } = require("./postgress_db");

// define an async function that will execute the queries
async function addProductToWishlistAndDeleteFromCart(userId, productId, wishlistId, selectedImageUrl, cartId) {
    try {
      // begin a transaction
      const client = await pool.connect();
      await client.query('BEGIN');
  
      // execute the first query
      const insertResult = await client.query(
        "INSERT into shop.t_wishlist_products(foreign_user_id, foreign_product_id, foreign_wishlist_id, selectedImageUrl) Values($1, $2, $3, $4) ON CONFLICT (foreign_user_id, foreign_product_id) DO UPDATE SET foreign_wishlist_id = $5 RETURNING id;",
        [userId, productId, wishlistId, selectedImageUrl, wishlistId]
      );
  
      // execute the second query
      const deleteResult = await client.query(
        "DELETE from shop.t_cart WHERE foreign_product_id = $6 and foreign_user_id = $7 and id = $8 RETURNING id",
        [productId, userId, cartId]
      );
  
      // commit the transaction
      await client.query('COMMIT');
  
      // return the results of both queries
      return { insertResult, deleteResult };
    } catch (error) {
      // if there's an error, rollback the transaction and throw the error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      // release the client back to the pool
      client.release();
    }
  }

module.exports = {
    addProductToWishlistAndDeleteFromCart
}