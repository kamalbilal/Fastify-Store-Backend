const { findAll, collections } = require("../../db/db");

async function getAllOffers(req, res) {
  const db = this.mongo.db;
  const allOffers = await findAll(db, collections.offers, {});
  return res.status(200).send(allOffers);
}
module.exports = getAllOffers;
