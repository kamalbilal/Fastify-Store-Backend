const { updateOne, collections } = require("../../db/db");

async function offerToggle(req, res) {
  const offerId = req.body.offerId;
  const on_off = req.body.on_off;

  let Object_offerId;
  try {
    Object_offerId = this.mongo.ObjectId(offerId);
  } catch (error) {
    console.log(error);
    Object_offerId = offerId;
  }

  if (!offerId) {
    return res.status(404).send({ error: true, success: false, reason: "no data" });
  }
  const db = this.mongo.db;
  const update = await updateOne(db, collections.offers, { _id: Object_offerId }, { $set: { display: on_off } });
  if (update["modifiedCount"] === 0) return res.status(404).send({ error: true, success: false });
  return res.status(200).send({ error: false, success: true, display: on_off });
}

module.exports = offerToggle;
