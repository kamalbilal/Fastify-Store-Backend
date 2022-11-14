const { findAllBySort, countAll, aggregate, collections } = require("../db/db");

async function getSearchedProducts(req, res) {
  const db = this.mongo.db;
  // const pageNumber = req.body.pageNumber * 1 > 0 ? req.body.pageNumber * limit : limit;

  // if (pageNumber === limit) {
  //   count = await countAll(db,collections.products, textSearchQuery);
  // }
  //

  let showNextPageAfter = 0;
  const limit = 10;
  const pageNumber = isNaN(req.body.pageNumber)
    ? 1
    : req.body.pageNumber * limit;
  let title = req.body.title.toLowerCase().slice(0, 24);
  const isServer = req.body.isServer;
  const sort = req.body.sort;

  let count = 0;

  title = title
    .split(" ")
    .map((str) => '"' + str + '"')
    .join(" ");


  const textSearchQuery = { $text: { $search: title } };
  let sortby = null;
  let fields = [];
  if (isServer === true) {
    // count = await countAll(db, collections.products, textSearchQuery);
    showNextPageAfter = 29;

    const common = await aggregate(db, collections.products, [
      { $match: textSearchQuery },
      
      {
        $unwind: "$specsForMongoDb",
      },

      {
        $group: {
          _id: "$specsForMongoDb.attrName",
          values: { $push: "$specsForMongoDb.attrValue" },
          count: {
            $sum: 1,
          },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 8 },
      {
        $project: {
          _id: 0,
          data: { key: "$_id", values: "$values" },
        },
      },
      { $unwind:  { path: "$data.values" } },

      {
        $group: {
          _id: "$data",
          count: {
            $sum: 1,
          },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 15 },
      {
        $project: {
          _id: 0,
          name: "$_id.key",
          value: "$_id.values",
        },
      },
      
    ]);
    const field = {};
    common.forEach((element) => {
      if (
        element.name.toLowerCase() === "origin" ||
        element.name.toLowerCase() === "language" ||
        element.name.includes("/")
      )
        return;

      if (element.value) {
        if (field.hasOwnProperty(element.name)) {
          field[element.name].push(element.value);
        } else {
          field[element.name] = [element.value];
        }
      }
    });

    Object.keys(field).forEach((element) => {
      if (field[element].length > 1) {
        fields.push({
          fieldName: element,
          fieldValues: field[element],
        });
      }
    });
  }
  if (sort === "priceLow") {
    sortby = { maxPrice: 1 };
  } else if (sort === "priceHigh") {
    sortby = { maxPrice: -1 };
  }
  const allOffers = await findAllBySort(
    db,
    collections.products,
    textSearchQuery,
    sortby,
    pageNumber - limit,
    limit,
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
      shippingPrice: {
        $ifNull: [{ $arrayElemAt: ["$shipping.displayAmount", 0] }, null],
      },
      specs: "$specs",
    }
  );

  return res.status(200).send({
    success: true,
    count,
    products: allOffers,
    pageNumber: req.body.pageNumber,
    countOnEveryRequest: limit,
    showNextPageAfter,
    fields,
    title,
  });
}
module.exports = getSearchedProducts;
