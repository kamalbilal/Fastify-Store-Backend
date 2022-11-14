const { findOneProduct } = require("../db/db");

async function getProductData(req, res) {
  let id = req.body.id;
  const product_name = req.body.product_name;
  if (!id) return res.status(404).send({ error: true, code: "Error Code 3" });
  let objectId;
  try {
    objectId = id
  } catch {
    objectId = id;
    return res.status(404).send({ error: true, code: "Error Code 4" });
  }
  if (!objectId) return res.status(404).send({ error: true, code: "Error Code 3" });

  console.time("Get Product Data");
  let output = await findOneProduct(objectId);
  console.timeEnd("Get Product Data");
  if (!output) return res.status(404).send({ error: true, code: "Error Code 5" });
  // if (output && output["title"] === product_name) {
  return res.status(200).send(output);
  // } else {
  // return res.status(404).send({ error: true, code: "Error Code 5" });
  // }
}

module.exports = getProductData;
