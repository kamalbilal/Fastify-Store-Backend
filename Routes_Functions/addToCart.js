const { updateOne, collections } = require("../db/db");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../passwords");

async function addToCart(req, res) {
  const cookie = req.unsignCookie(req.cookies["token"]).value;
  let cartData = req.body.cartData;
  const type = req.body.type;
  let id = null;

  if (!cookie || !cartData) {
    return res.status(404).send({ error: true, code: "Error Code 6" });
  }

  try {
    id = jwt.verify(cookie, jwtSecret);
    id = id["id"];
  } catch (error) {
    console.log(error);
    return res.status(404).send({ error: true, code: "Error Code 7" });
  }
  if (!id) {
    return res.status(404).send({ error: true, code: "Error Code 6" });
  }

  let update = null;
  const db = this.mongo.db;
  if (type === "add") {
    update = await updateOne(db, collections.users, { _id: id }, { $push: { cart: { ...cartData } } });
  } else if (type === "remove") {
    update = await updateOne(db, collections.users, { _id: id }, { $pull: { cart: { _id: cartData } } });
  }
  if (update.modifiedCount === 0) {
    return res.status(404).send({ error: true, success: false, cartData: cartData, reason: "No Modification" });
  }
  return res.status(200).send({ error: false, success: true, type, cartData: cartData });
}

module.exports = addToCart;
