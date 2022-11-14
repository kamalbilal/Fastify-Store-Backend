const { updateOne, collections } = require("../../db/db");

async function addOffer(req, res) {
  const productId = req.body.productId;
  const offerId = req.body.offerId;
  const offerName = req.body.offerName;
  const newDiscount = req.body.newDiscount;
  const startingDateTime = req.body.startingDateTime || null;
  const endingDateTime = req.body.endingDateTime || null;

  let Object_offerId;
  let Object_productId;

  try {
    Object_offerId = this.mongo.ObjectId(offerId);
    Object_productId = this.mongo.ObjectId(productId);
  } catch (error) {
    console.log(error);
    Object_offerId = offerId;
    Object_productId = productId;
  }

  if (!Object_offerId || !Object_productId || !offerName)
    return res.status(404).send({ error: true, reason: { productId, offerId, offerName } });

  const db = this.mongo.db;
  const update = await updateOne(
    db,
    collections.offers,
    { _id: Object_offerId },
    { $addToSet: { offers: Object_productId } }
  );
  if (update["matchedCount"] === 0) {
    return res.status(400).send({ error: true, success: false, error: "Error on inserting", update });
  }
  const updateNewDiscount = await updateOne(
    db,
    collections.products,
    { _id: Object_productId },
    {
      $set: {
        newDiscount: newDiscount,
        newDiscountOfferName: offerName,
        newDiscountDetails: { startingDateTime: startingDateTime, endingDateTime: endingDateTime },
      },
    }
  );

  return res.status(200).send({ error: false, success: true, update });
}

module.exports = addOffer;
