const { insertOne, collections } = require("../../db/db");

async function createNewOffers(req, res) {
  const offerName = req.body.offerName;
  if (!offerName) {
    return res.status(404).send({ error: true, success: false, reason: "no data" });
  }
  const db = this.mongo.db;
  const insert = await insertOne(db, collections.offers, { name: offerName, offers: [], display: false });

  return res.status(200).send({ error: false, success: true, insertedId: insert["insertedId"], display: false });
}

module.exports = createNewOffers;
