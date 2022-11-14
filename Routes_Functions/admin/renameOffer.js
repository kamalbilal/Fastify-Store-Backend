const { updateOne, updateMany, collections } = require("../../db/db");

async function renameOffer(req, res) {
  const offerId = req.body.offerId;
  const offerName = req.body.offerName;
  const activeOffers = req.body.activeOffers;

  let Object_offerId;
  let Object_activeOffers = [];

  try {
    Object_offerId = this.mongo.ObjectId(offerId);
    if (activeOffers) {
      for (let index = 0; index < activeOffers.length; index++) {
        Object_activeOffers.push(this.mongo.ObjectId(activeOffers[index]));
      }
    }
  } catch (error) {
    console.log(error);
    Object_offerId = offerId;
  }

  if (!Object_offerId || !offerName) return res.status(404).send({ error: true, success: false, reason: "no data" });

  const db = this.mongo.db;
  const updateOfferName = await updateOne(
    db,
    collections.offers,
    { _id: Object_offerId },
    { $set: { name: offerName } }
  );

  if (updateOfferName["modifiedCount"] === 0)
    return res.status(404).send({ error: true, success: false, reason: "Nothing To Rename" });

  if (activeOffers) {
    const resetAllOffersNewDiscount = await updateMany(
      db,
      collections.products,
      {
        _id: {
          $in: Object_activeOffers,
        },
      },
      {
        $set: { newDiscountOfferName: offerName },
      }
    );
    console.log(resetAllOffersNewDiscount);
  }
  return res.status(200).send({ error: false, success: true, offerName: offerName });
}

module.exports = renameOffer;
