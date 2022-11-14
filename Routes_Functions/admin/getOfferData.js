const { collections, aggregate } = require("../../db/db");

async function getOfferData(req, res) {
  const offerId = req.body.offerId;
  let Object_offerId;
  try {
    Object_offerId = this.mongo.ObjectId(offerId);
  } catch (error) {
    console.log(error);
    Object_offerId = offerId;
  }

  if (!Object_offerId) {
    return res.status(200).send({ error: true, success: false, reason: "Inavlid OfferId" });
  }

  let offersData = null;
  const db = this.mongo.db;

  // try {
  offersData = await aggregate(db, collections.offers, [
    {
      $match: {
        _id: Object_offerId,
      },
    },
    {
      $lookup: {
        from: collections.products,
        localField: "offers",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              _display: 1,
              title: 1,
              link: 1,
              images: 1,
              minPrice: 1,
              maxPrice: 1,
              discountNumber: 1,
              discount: 1,
              minPrice_AfterDiscount: 1,
              maxPrice_AfterDiscount: 1,
              newDiscount: 1,
              newDiscountOfferName: 1,
              newDiscountDetails: 1,
            },
          },
        ],
        as: "allProducts",
      },
    },
  ]);
  // } catch (error) {
  //   console.log(error);
  //   return res.status(404).send({ error: true, success: false });
  // }

  if (!offersData || offersData.length === 0) {
    return res.status(404).send({ error: true, success: false });
  }
  return res.status(200).send({ error: false, success: true, offersData: [...offersData] });
}

module.exports = getOfferData;
