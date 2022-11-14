const { findAll, countAll, collections } = require("../../db/db");

async function getAllProducts(req, res) {
  const limit = req.body.limit ? req.body.limit * 1 : 20;
  const pageNumber = req.body.pageNumber * 1 > 0 ? req.body.pageNumber * limit : limit;
  const discount = req.body.discount * 1;
  const title = req.body.title;
  const minPrice = req.body.minPrice * 1;
  const maxPrice = req.body.maxPrice * 1;
  const minPrice_AfterDiscount = req.body.minPrice_AfterDiscount * 1;
  const maxPrice_AfterDiscount = req.body.maxPrice_AfterDiscount * 1;
  const offerName = req.body.offerName;

  let query;
  let sort;
  if (discount) {
    query = { discountNumber: { $gte: discount } };
    sort = { discountNumber: 1 };
  } else if (title) {
    query = { $text: { $search: title } };
    sort = {};
  } else if (minPrice) {
    query = { minPrice: { $gte: minPrice } };
    sort = { minPrice: 1 };
  } else if (maxPrice) {
    query = { maxPrice: { $lte: maxPrice } };
    sort = { maxPrice: 1 };
  } else if (minPrice_AfterDiscount) {
    query = { minPrice_AfterDiscount: { $gte: minPrice_AfterDiscount } };
    sort = { minPrice_AfterDiscount: 1 };
  } else if (maxPrice_AfterDiscount) {
    query = { maxPrice_AfterDiscount: { $lte: maxPrice_AfterDiscount } };
    sort = { maxPrice_AfterDiscount: 1 };
  }

  query = {
    ...query,
    $or: [{ newDiscountOfferName: { $eq: offerName } }, { newDiscount: { $eq: 0 } }],
  };

  let count = 0;
  const db = this.mongo.db;
  console.log({ pageNumber, limit });
  if (pageNumber === limit) {
    count = await countAll(db, collections.products, query);
  }
  //

  const allOffers = await findAll(
    db,
    collections.products,
    query,
    { skip: pageNumber - limit, limit: limit },
    {
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
      newDiscountDetails: 1,
      newDiscountOfferName: 1,
    },
    sort
  );
  return res.status(200).send({ totalCount: count, products: allOffers });
}
module.exports = getAllProducts;
