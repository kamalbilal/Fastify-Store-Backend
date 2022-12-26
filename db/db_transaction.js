const queryBuilder = require("./queriesBuilder");
const { pool } = require("./postgress_db");

async function add_updateProductToCart_transaction(productId, userId, cartName, quantity, price, shippingPrice, discount, selectedProperties, shippingDetails, selectedImageUrl) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let output = await client.query(queryBuilder.checkProductExistInUserCartQuery(cartName, userId));
    if (output.rows.length > 0) {
      output = await client.query(queryBuilder.updateProductToCartQuery(productId, userId, cartName, quantity, price, shippingPrice, discount, selectedProperties, shippingDetails, selectedImageUrl));
    } else {
      output = await client.query(queryBuilder.addProductToCartQuery(productId, userId, cartName, quantity, price, shippingPrice, discount, selectedProperties, shippingDetails, selectedImageUrl));
      if (output.rows.length > 0) await client.query(queryBuilder.incrementCartCountQuery(userId));
    }
    await client.query("COMMIT");
    return output.rows[0];
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    return null;
  } finally {
    client.release();
  }
}

module.exports = {
  add_updateProductToCart_transaction,
};
