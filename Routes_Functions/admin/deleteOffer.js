const { deleteOne, updateMany, collections } = require("../../db/db");

async function deleteOffer(req, res) {
  const offerId = req.body.offerId;
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

  if (!Object_offerId) return res.status(404).send({ error: true, success: false, reason: "no data" });

  const db = this.mongo.db;
  const deleteOffer = await deleteOne(db, collections.offers, { _id: Object_offerId });

  if (deleteOffer["deletedCount"] === 0)
    return res.status(404).send({ error: true, success: false, reason: "Nothing To delete" });

  if (activeOffers) {
    try {
      const resetAllOffersNewDiscount = await updateMany(
        db,
        collections.products,
        {
          _id: {
            $in: Object_activeOffers,
          },
        },
        {
          $set: { newDiscount: 0, newDiscountOfferName: null },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  return res.status(200).send({
    error: false,
    success: true,
    deleted: deleteOffer["deletedCount"] || 0,
    deleteOffer,
  });
}

module.exports = deleteOffer;
