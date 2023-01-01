const { getCertainWishList } = require("../db/db");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../passwords");

async function getCertainWishListData(req, res) {
  const pageNumber = req.body.pageNumber;
  const wishlistId = req.body.wishlistId;
  const wishlistName = req.body.wishlistName;
  const cookie = req.unsignCookie(req.cookies["token"]).value;
  let userId = null;
  console.log(cookie);
  if (!cookie || !wishlistId || !wishlistName) return res.status(404).send({ error: true, code: "Error Code 3" });

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

  console.time("Get WishList Data page number");
  let output = await getCertainWishList(userId, wishlistId, pageNumber);
  console.timeEnd("Get WishList Data page number");
  if (!output) return res.status(404).send({ error: true, code: "Error Code 5" });
  // if (output && output["title"] === product_name) {
  return res.status(200).send({data:output, wishlistId: wishlistId, wishlistName, pageNumber: pageNumber});
  // } else {
  // return res.status(404).send({ error: true, code: "Error Code 5" });
  // }
}

module.exports = getCertainWishListData;
