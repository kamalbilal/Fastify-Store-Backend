const { updateOne, collections } = require("../../db/db");

async function removeProductFromOffer(req, res) {
  const productId = req.body.productId;
  const offerId = req.body.offerId;

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

  if (!Object_offerId || !Object_productId)
    return res.status(404).send({ error: true, reason: { productId, offerId } });

  const db = this.mongo.db;
  const update = await updateOne(
    db,
    collections.offers,
    { _id: Object_offerId },
    { $pull: { offers: Object_productId } }
  );
  const alsoRemoveFromProducts = await updateOne(
    db,
    collections.products,
    { _id: Object_productId },
    { $set: { newDiscount: 0, newDiscountOfferName: null } }
  );
  return res.status(200).send({ error: false, success: true, offerId, productId, update, alsoRemoveFromProducts });
}

module.exports = removeProductFromOffer;
