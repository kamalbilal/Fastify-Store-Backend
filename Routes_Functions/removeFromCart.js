const { deleteProductToCart } = require("../db/db");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../passwords");

async function removeFromCart(req, res) {
  const cookie = req.unsignCookie(req.cookies["token"]).value;
  const productId = req.body.productId
  const cartId = req.body.id
  let userId = null;

  if (!cookie || !productId || isNaN(cartId)) {
    return res.status(404).send({ error: true, code: "Error Code 6" });
  }
  try {
    userId = jwt.verify(cookie, jwtSecret);
    userId = userId["id"];
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: true, code: "Error Code 7" });
  }
  if (!userId) {
    return res.status(404).send({ error: true, code: "Error Code 6" });
  }

  const deleteProduct = await deleteProductToCart(productId, userId, cartId);
  if (!deleteProduct || !deleteProduct.hasOwnProperty("id")) {
    return res.status(404).send({ error: true, success: false, reason: "No Modification, something's wrong" });
  }
  return res.status(200).send({ error: false, success: true, deletedId: deleteProduct["id"] });
}

module.exports = removeFromCart;
