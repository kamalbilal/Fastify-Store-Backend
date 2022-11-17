const { add_updateProductToCart } = require("../db/db");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../passwords");

async function addToCart(req, res) {
  const cookie = req.unsignCookie(req.cookies["token"]).value;
  const productId = req.body.productId
  const cartName = req.body.cartName
  const newPrice = req.body.newPrice
  const oldPrice = req.body.oldPrice
  const discount = req.body.discount
  const quantity = req.body.quantity
  const selectedProperties = req.body.selectedProperties
  const shippingDetails = req.body.shippingDetails
  let userId = null;


  if (!cookie || !productId || !cartName || isNaN(newPrice) || isNaN(oldPrice) || isNaN(discount) || !quantity || !selectedProperties || !shippingDetails) {
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

  const update = await add_updateProductToCart(productId, userId, cartName, quantity, newPrice, oldPrice,discount, selectedProperties, shippingDetails);
  // if (update.modifiedCount === 0) {
  //   return res.status(404).send({ error: true, success: false, reason: "No Modification" });
  // }
  return res.status(200).send({ error: false, success: true,update });
}

module.exports = addToCart;
