const { getUserWishList } = require("../db/db");

async function getProductData(req, res) {
  let userId = req.body.userId;
 
  if (!userId) return res.status(404).send({ error: true, code: "Error Code 3" });

  console.time("Get WishList Data");
  let output = await getUserWishList(userId);
  console.timeEnd("Get WishList Data");
  if (!output) return res.status(404).send({ error: true, code: "Error Code 5" });
  // if (output && output["title"] === product_name) {
  return res.status(200).send(output);
  // } else {
  // return res.status(404).send({ error: true, code: "Error Code 5" });
  // }
}

module.exports = getProductData;
