const { addProductToWishlist } = require("../db/db");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../passwords");

async function addToWishList(req, res) {
  const cookie = req.unsignCookie(req.cookies["token"]).value;
  const productId = req.body.productId
  const cartId = req.body.cartId
  const wishListNameId = req.body.wishListNameId
  const selectedImageUrl = req.body.selectedImageUrl
  let userId = null;


  if (!cookie || !productId || !selectedImageUrl || !cartId) {
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

  // const addProductToWishlistOutput = await addProductToWishlist(userId, productId, wishListNameId, selectedImageUrl, cartId);
  const addProductToWishlistOutput = false;
  if (!addProductToWishlistOutput || !addProductToWishlistOutput.hasOwnProperty("id")) {
    return res.status(404).send({ error: true, success: false, reason: "No Modification, something's wrong" });
  }
  return res.status(200).send({ error: false, success: true, id: addProductToWishlistOutput["id"] });
}

module.exports = addToWishList;
