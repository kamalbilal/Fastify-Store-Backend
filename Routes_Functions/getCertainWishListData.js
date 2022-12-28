const { getCertainWishList } = require("../db/db");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../passwords");

async function getCertainWishListData(req, res) {
  const pageNumber = req.body.pageNumber;
  let userId = null;

  if (!cookie) return res.status(404).send({ error: true, code: "Error Code 3" });

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
  let output = await getCertainWishList(userId, pageNumber);
  console.timeEnd("Get WishList Data page number");
  if (!output) return res.status(404).send({ error: true, code: "Error Code 5" });
  // if (output && output["title"] === product_name) {
  return res.status(200).send(output);
  // } else {
  // return res.status(404).send({ error: true, code: "Error Code 5" });
  // }
}

module.exports = getCertainWishListData;
