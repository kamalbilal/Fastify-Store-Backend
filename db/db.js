const { query } = require("./postgress_db");
const queryBuilder = require("./queriesBuilder");
// const PS = require("./preparedStatements");

async function findOneProduct(productId) {
  try {
    const output = await query(queryBuilder.getSingleProductQuery(productId));
    return output.rows[0];
  } finally {
    // await client.close
  }
}
async function add_updateProductToCart(productId, userId, cartName, quantity, price, shippingPrice, discount, selectedProperties, shippingDetails, selectedImageUrl) {
  try {
    let output = await query(queryBuilder.checkProductExistInUserCartQuery(cartName, userId));
    if (output.rows.length > 0) {
      output = await query(queryBuilder.updateProductToCartQuery(productId, userId, cartName, quantity, price, shippingPrice, discount, selectedProperties, shippingDetails, selectedImageUrl));
    } else {
      output = await query(queryBuilder.addProductToCartQuery(productId, userId, cartName, quantity, price, shippingPrice, discount, selectedProperties, shippingDetails, selectedImageUrl));
      if (output.rows.length > 0) query(queryBuilder.incrementCartCountQuery(userId));
    }
    return output.rows[0];
  } catch (e) {
    console.error(e);
    return null;
  }
}
async function deleteProductToCart(productId, userId, cartId) {
  try {
    output = await query(queryBuilder.deleteProductToCartQuery(productId, userId, cartId));
    // if (output.rows.length > 0) query(queryBuilder.incrementCartCountQuery(userId));

    return output.rows[0];
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function addProductToWishlist(userId, productId, wishListNameId, selectedImageUrl, cartId) {
  try {
    // output = await query(queryBuilder.addProductToWishlistQuery(userId, productId, wishListNameId, selectedImageUrl));
    output = await query(queryBuilder.addProductToWishlistQuery(userId, productId, wishListNameId, selectedImageUrl, cartId));
    await query(queryBuilder.deleteProductToCartQuery(productId, userId, cartId));

    return output.rows[0];
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function getUserWishList(userId) {
  try {
    const data = {};
    output = await query(queryBuilder.getUserWishListNamesQuery(userId));
    if (output.rows.length > 0) {
      data["wishListNames"] = output.rows[0]["wishListNames"];
      data["wishListIds"] = output.rows[0]["wishListIds"];
      data["wishListData"] = {};

      const totalIdsLength = output.rows[0]["wishListIds"].length;

      if (totalIdsLength > 0) {
        for (let index = 0; index < totalIdsLength; index++) {
          const wishListId = data["wishListIds"][index];
          output = await query(queryBuilder.getUserWishListDataQuery(wishListId, 5));
          if (output && output["rows"].length > 0) {
            data["wishListData"][output.rows[0]["wishListName"]] = output.rows;
          }
        }
      }
    }

    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function getCertainWishList(userId, wishListId, pageNumber = 1) {
  try {
    const output = await query(queryBuilder.getCertainWishListDataQuery(userId, wishListId, 5, pageNumber));

    return output.rows;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function findAll(db, collection_name, query, options, getOnly = null, sort) {
  try {
    let output;
    if (getOnly === null) {
      output = await db.collection(collection_name).find(query, options).toArray();
    } else {
      output = await db.collection(collection_name).find(query, options).project(getOnly).sort(sort).toArray();
    }
    return output;
  } finally {
    // await client.close();
  }
}

async function findAllBySort(db, collection_name, query, sort, skip, limit, getOnly = null) {
  try {
    let output;
    if (getOnly === null) {
      output = await db.collection(collection_name).find(query).sort(sort).skip(skip).limit(limit).toArray();
    } else {
      console.log({ sort, skip, limit });
      output = await db.collection(collection_name).find(query).project(getOnly).sort(sort).skip(skip).limit(limit).toArray();
    }
    return output;
  } finally {
    // await client.close();
  }
}
async function countAll(db, collection_name, query, options) {
  try {
    output = await db.collection(collection_name).countDocuments(query, options);
    return output;
  } finally {
    // await client.close();
  }
}

async function aggregate(db, collection_name, query) {
  try {
    const output = await db.collection(collection_name).aggregate(query, { allowDiskUse: true }).toArray();

    return output;
  } finally {
    // await client.close();
  }
}

async function signUpUser(email, hasedPassword) {
  try {
    // await client.connect();
    const output = await query(queryBuilder.signUpUserQuery(email, hasedPassword));
    
    // when a new user sign up do these default things
    if (output.rows.length > 0 && output.rows[0].hasOwnProperty("id")) {
      console.log(output.rows[0]);
      const userId = output.rows[0]["id"]
      await query(queryBuilder.createDefaultWishlist(userId));
    }
    // when a new user sign up do these default things end

    return output;
  } finally {
    // await client.close();
  }
}
async function getUserData(id) {
  const data = {};
  try {
    // await client.connect();
    data["userData"] = (await (await query(queryBuilder.getUserDataQuery(id))).rows[0]) || null;
    data["userCart"] = await (await query(queryBuilder.getUserCartDataQuery(id))).rows;
    data["userWishList"] = {wishListNames: [], wishListIds: []}
    output = await query(queryBuilder.getUserWishListNamesQuery(id, 0));
    if (output.rows.length > 0) {
      data["userWishList"]["wishListNames"] = output.rows[0]["wishListNames"];
      data["userWishList"]["wishListIds"] = output.rows[0]["wishListIds"];
    }
    return data;
  } finally {
    // await client.close();
  }
}

async function checkUserExist(email) {
  try {
    // await client.connect();
    const output = await query(queryBuilder.checkUserExistQuery(email));
    return output;
  } finally {
    // await client.close();
  }
}

async function userLogin(email) {
  try {
    // await client.connect();
    const output = await query(queryBuilder.userLoginQuery(email));
    return output;
  } finally {
    // await client.close();
  }
}

async function insertOne(db, collection_name, query) {
  try {
    // await client.connect();
    const output = await db.collection(collection_name).insertOne(query);
    return output;
  } finally {
    // await client.close();
  }
}

async function deleteOne(db, collection_name, query) {
  try {
    // await client.connect();
    const output = await db.collection(collection_name).deleteOne(query);
    return output;
  } finally {
    // await client.close();
  }
}

async function updateOne(db, collection_name, filter, query, options) {
  try {
    // await client.connect();
    const output = await db.collection(collection_name).updateOne(filter, query, options);
    return output;
  } finally {
    // await client.close();
  }
}

async function updateMany(db, collection_name, filter, query, options) {
  try {
    // await client.connect();
    const output = await db.collection(collection_name).updateMany(filter, query, options);
    return output;
  } finally {
    // await client.close();
  }
}

module.exports = {
  findOneProduct,
  findAll,
  findAllBySort,
  countAll,
  insertOne,
  updateOne,
  updateMany,
  aggregate,
  deleteOne,
  signUpUser,
  checkUserExist,
  userLogin,
  getUserData,
  add_updateProductToCart,
  deleteProductToCart,
  getUserWishList,
  addProductToWishlist,
  getCertainWishList
};
