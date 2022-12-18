const { pool } = require("./postgress_db");

const getSingleProductQuery = `select 
t_basicInfo.display as "_display",
t_basicInfo.product_link as "link",
t_basicInfo.minprice as "minPrice",
t_basicInfo.maxprice as "maxPrice",
t_basicInfo.discountnumber as "discountNumber",
t_basicInfo.discount as "discount",
t_basicInfo.minprice_afterdiscount as "minPrice_AfterDiscount",
t_basicInfo.maxprice_afterdiscount as "maxPrice_AfterDiscount",
t_basicInfo.multiunitname as "multiUnitName",
t_basicInfo.oddunitname as "oddUnitName",
t_basicInfo.maxpurchaselimit as "maxPurchaseLimit",
t_basicInfo.buylimittext as "buyLimitText",
t_basicInfo.quantityavaliable as "quantityAvaliable",
t_basicInfo.comingSoon as "comingSoon",
t_productId.id as "productId",
t_productId.myProductId as "longProductId",
t_titles.title,
t_mainimages.image_link_array as "images",
t_properties.property_array as "sizesColors",
t_pricelist.byname as "priceList_InNames",
t_pricelist.bynumber as "priceList_InNumbers",
t_pricelist.bydata  as "priceList_Data",
t_specs.specs as "specs",
t_shippingdetails.shipping as "shipping",
t_modifieddescription.description as "modified_description_content"
from shop.t_productId
join shop.t_basicInfo on t_basicInfo.foreign_id = t_productId.id
join shop.t_titles on t_titles.foreign_id = t_productId.id
join shop.t_mainimages on t_mainimages.foreign_id = t_productId.id
join shop.t_properties on t_properties.foreign_id = t_productId.id
join shop.t_pricelist on t_pricelist.foreign_id = t_productId.id
join shop.t_specs on t_specs.foreign_id = t_productId.id
join shop.t_shippingdetails on t_shippingdetails.foreign_id = t_productId.id
join shop.t_modifieddescription on t_modifieddescription.foreign_id = t_productId.id
where t_productId.myProductId = $1;`;

const signUpUserQuery = `INSERT into shop.t_users(email, password) Values($1, $2) RETURNING id;`;

const createDefaultWishlist = `INSERT into shop.t_wishlist(foreign_user_id, wishlistname) Values($1, $2);`;

const addProductToWishlistQuery = `INSERT into shop.t_wishlist_products(foreign_user_id, foreign_product_id, foreign_wishlist_id, selectedImageUrl) Values($1, $2, $3, $4) ON CONFLICT (foreign_user_id, foreign_product_id) DO UPDATE SET foreign_wishlist_id = $5 RETURNING id;`;

const addProductToCartQuery = `INSERT into shop.t_cart(foreign_product_id, foreign_user_id, cartName, quantity, price, shippingPrice, discount, selectedProperties, shippingDetails, selectedImageUrl) Values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id;`;

const incrementCartCountQuery = `UPDATE shop.t_users SET cartCount = cartCount + 1 WHERE id = $1;`;

const decrementCartCountQuery = `UPDATE shop.t_users SET cartCount = cartCount - 1 WHERE id = $1;`;

const updateProductToCartQuery = `UPDATE shop.t_cart SET quantity = $1, price = $2, shippingPrice = $3, discount = $4, selectedProperties = $5, shippingDetails = $6, selectedImageUrl = $7 WHERE foreign_user_id = $8 and foreign_product_id = $9 and cartName = $10 RETURNING id;`;

const deleteProductToCartQuery = `DELETE from shop.t_cart WHERE foreign_product_id = $1 and foreign_user_id = $2 and id = $3 RETURNING id;`;

const checkProductExistInUserCartQuery = `SELECT id from shop.t_cart WHERE cartName = $1 and foreign_user_id = $2;`;

const checkUserExistQuery = `SELECT email from shop.t_users WHERE email = $1;`;

const getUserCartDataQuery = `SELECT 
title,
t_cart.id as "cartId",
t_cart.foreign_product_id as "productId",
t_productId.myProductId as "longProductId",
cartname as "cartName",
selectedImageUrl as "selectedImageUrl",
price as "selectedPrice",
t_cart.quantity as "selectedQuantity",
t_cart.discount as "selectedDiscount",
selectedproperties as "selectedProperties",
shippingdetails as "selectedShippingDetails",
shippingprice as "selectedShippingPrice",
minprice as "minPrice",
maxprice as "maxPrice",
multiunitname as "multiUnitName",
oddunitname as "oddUnitName",
maxpurchaselimit as "maxPurchaseLimit",
buylimittext as "buyLimitText",
quantityavaliable as "quantityAvaliable",
byname as "priceList_InNames",
bynumber as "priceList_InNumbers",
bydata as "priceList_Data"
FROM shop.t_cart 
JOIN shop.t_productId ON t_productId.id = t_cart.foreign_product_id
JOIN shop.t_titles ON t_titles.foreign_id = t_cart.foreign_product_id
JOIN shop.t_basicinfo ON t_basicinfo.foreign_id = t_cart.foreign_product_id
JOIN shop.t_pricelist ON t_pricelist.foreign_id = t_cart.foreign_product_id
WHERE foreign_user_id = $1;`;

const getUserDataQuery = `SELECT email from shop.t_users WHERE id = $1;`;

const userLoginQuery = `SELECT id, email, password from shop.t_users WHERE email = $1;`;

const getUserWishListNamesQuery = `SELECT ARRAY_AGG(wishlistname) as "wishListNames", ARRAY_AGG(id) as "wishListIds" from shop.t_wishList WHERE foreign_user_id = $1 GROUP BY foreign_user_id;`;

const getUserWishListNamesQueryWithLimit = `SELECT ARRAY_AGG(wishlistname) as "wishListNames", ARRAY_AGG(id) as "wishListIds" from shop.t_wishList WHERE foreign_user_id = $1 GROUP BY foreign_user_id LIMIT $2;`;

const getUserWishListDataQuery = `
SELECT     
t_titles.title,
t_wishlist_products.id as "wishListId",
t_wishlist_products.selectedImageUrl as "selectedImageUrl",
t_wishlist_products.foreign_product_id as "productId",
t_productId.myProductId as "longProductId",
t_wishlist.wishlistname as "wishListName",
minprice as "minPrice",
maxprice as "maxPrice"
From shop.t_wishlist_products 
JOIN shop.t_wishlist ON t_wishlist.id = t_wishlist_products.foreign_wishlist_id
JOIN shop.t_productId ON t_productId.id = t_wishlist_products.foreign_product_id
JOIN shop.t_titles ON t_titles.foreign_id = t_wishlist_products.foreign_product_id
JOIN shop.t_basicinfo ON t_basicinfo.foreign_id = t_wishlist_products.foreign_product_id
where t_wishlist_products.foreign_wishlist_id = $1 LIMIT $2;
`;

/**
 * This function wants shop.t_wishlist_products.foreign_wishlist_id = $1 LIMIT $2;
 * @param {number} foreign_wishlist_id
 * @param {number} limit
 */
function getUserWishListDataQueryFunc(foreign_wishlist_id, limit) {
  if (!foreign_wishlist_id || !limit) {
    console.log({ foreign_wishlist_id, limit });
    throw new Error("foreign_wishlist_id, limit are required, Watch console log for more...");
  }
  return getUserWishListDataQuery;
}

/**
 * This function wants shop.t_wishList WHERE foreign_user_id = $1;
 * @param {number} foreign_user_id
 * @param {number} limit
 */
function getUserWishListNamesQueryWithLimitFunc(foreign_user_id, limit) {
  if (!foreign_user_id || !limit) {
    console.log(foreign_user_id, limit);
    throw new Error("foreign_user_id, limit are required, Watch console log for more...");
  }
  return getUserWishListNamesQueryWithLimit;
}

/**
 * This function wants shop.t_wishList WHERE foreign_user_id = $1;
 * @param {number} foreign_user_id
 */
function getUserWishListNamesQueryFunc(foreign_user_id) {
  if (!foreign_user_id) {
    console.log({ foreign_user_id });
    throw new Error("foreign_user_id are required, Watch console log for more...");
  }
  return getUserWishListNamesQuery;
}

/**
 * This function wants shop.t_users WHERE email = $1;
 * @param {string} email
 */
function userLoginQueryFunc(email) {
  if (!email) {
    console.log({ email });

    throw new Error("email are required, Watch console log for more...");
  }
  return userLoginQuery;
}

/**
 * This function wants shop.t_users.id;
 * @param {number} id
 */
function getUserDataQueryFunc(id) {
  if (!id) {
    console.log({ id });

    throw new Error("id are required, Watch console log for more...");
  }
  return getUserDataQuery;
}

/**
 * This function wants shop.t_cart foreign_user_id = $1;
 * @param {number} foreign_user_id
 */
function getUserCartDataQueryFunc(foreign_user_id) {
  if (!foreign_user_id) {
    console.log({ foreign_user_id });
    throw new Error("foreign_user_id are required, Watch console log for more...");
  }
  return getUserCartDataQuery;
}

/**
 * This function wants shop.t_users WHERE email;
 * @param {string} email
 */
function checkUserExistQueryFunc(email) {
  if (!email) {
    console.log({ email });
    throw new Error("email are required, Watch console log for more...");
  }
  return checkUserExistQuery;
}

/**
 * This function wants shop.t_cart WHERE cartName = $1 and foreign_user_id = $2;
 * @param {string} cartName
 * @param {number} foreign_user_id
 */
function checkProductExistInUserCartQueryFunc(cartName, foreign_user_id) {
  if (!cartName || !foreign_user_id) {
    console.log({ cartName, foreign_user_id });
    throw new Error("cartName, foreign_user_id are required, Watch console log for more...");
  }
  return checkProductExistInUserCartQuery;
}

/**
 * This function wants shop.t_cart WHERE foreign_product_id = $1 and foreign_user_id = $2 and id = $3
 * @param {number} foreign_product_id
 * @param {number} foreign_user_id
 * @param {number} id
 */
function deleteProductToCartQueryFunc(foreign_product_id, foreign_user_id, id) {
  if (!foreign_product_id || !foreign_user_id || !id) {
    console.log({ foreign_product_id, foreign_user_id, id });

    throw new Error("foreign_product_id, foreign_user_id, id are required, Watch console log for more...");
  }
  return deleteProductToCartQuery;
}

/**
 * This function wants shop.t_cart quantity = $1, price = $2, shippingPrice = $3, discount = $4, selectedProperties = $5, shippingDetails = $6, selectedImageUrl = $7 WHERE foreign_user_id = $8 and foreign_product_id = $9 and cartName = $10.
 * @param {number} quantity
 * @param {float} price
 * @param {float} shippingPrice
 * @param {float} discount
 * @param {object} selectedProperties
 * @param {object} shippingDetails
 * @param {string} selectedImageUrl
 * @param {number} foreign_user_id
 * @param {number} foreign_product_id
 * @param {string} cartName
 */
function updateProductToCartQueryFunc(quantity, price, shippingPrice, discount, selectedProperties, shippingDetails, selectedImageUrl, foreign_user_id, foreign_product_id, cartName) {
  if (!quantity || isNaN(price) || isNaN(shippingPrice) || isNaN(discount) || !selectedProperties || !shippingDetails || !selectedImageUrl || !foreign_user_id || !foreign_product_id || !cartName) {
    console.log({ quantity, price, shippingPrice, discount, selectedProperties, shippingDetails, selectedImageUrl, foreign_user_id, foreign_product_id, cartName });
    throw new Error("quantity, price, shippingPrice, discount, selectedProperties, shippingDetails, selectedImageUrl, foreign_user_id, foreign_product_id, cartName are required, Watch console log for more...");
  }
  return updateProductToCartQuery;
}

/**
 * This function wants shop.t_users.id.
 * @param {number} id
 */
function decrementCartCountQueryFunc(id) {
  if (!id) {
    console.log({ id });
    throw new Error("id are required, Watch console log for more...");
  }
  return decrementCartCountQuery;
}

/**
 * This function wants shop.t_users.id.
 * @param {number} id
 */
function incrementCartCountQueryFunc(id) {
  if (!id) {
    console.log({ id });
    throw new Error("id are required, Watch console log for more...");
  }
  return incrementCartCountQuery;
}

/**
 * This function wants shop.t_cart(foreign_product_id, foreign_user_id, cartName, quantity, price, shippingPrice, discount, selectedProperties, shippingDetails, selectedImageUrl).
 * @param {number} foreign_product_id
 * @param {number} foreign_user_id
 * @param {string} cartName
 * @param {number} quantity
 * @param {float} price
 * @param {float} shippingPrice
 * @param {float} discount
 * @param {object} selectedProperties
 * @param {object} shippingDetails
 * @param {string} selectedImageUrl
 */
function addProductToCartQueryFunc(foreign_product_id, foreign_user_id, cartName, quantity, price, shippingPrice, discount, selectedProperties, shippingDetails, selectedImageUrl) {
  if (!foreign_product_id || !foreign_user_id || !cartName || isNaN(quantity) || isNaN(price) || isNaN(shippingPrice) || isNaN(discount) || !selectedProperties || !shippingDetails || !selectedImageUrl) {
    console.log({ foreign_product_id, foreign_user_id, cartName, quantity, price, shippingPrice, discount, selectedProperties, shippingDetails, selectedImageUrl });
    throw new Error("foreign_product_id, foreign_user_id, cartName, quantity, price, shippingPrice, discount, selectedProperties, shippingDetails, selectedImageUrl are required, Watch console log for more...");
  }
  return addProductToCartQuery;
}

/**
 * This function wants shop.t_wishlist_products(foreign_user_id, foreign_product_id, foreign_wishlist_id, selectedImageUrl).
 * @param {number} foreign_user_id
 * @param {number} foreign_product_id
 * @param {number} foreign_wishlist_id
 * @param {string} selectedImageUrl
 */
function addProductToWishlistQueryFunc(foreign_user_id, foreign_product_id, foreign_wishlist_id, selectedImageUrl) {
  if (!foreign_user_id || !foreign_product_id || !foreign_wishlist_id || !selectedImageUrl) {
    console.log({ foreign_user_id, foreign_product_id, foreign_wishlist_id, selectedImageUrl });
    throw new Error("foreign_user_id, foreign_product_id, foreign_wishlist_id, selectedImageUrl are required, Watch console log for more...");
  }
  return addProductToWishlistQuery;
}

/**
 * This function wants shop.t_wishlist(foreign_user_id, wishlistname).
 * @param {number} foreign_user_id
 * @param {string} wishlistname
 */
function createDefaultWishlistFunc(foreign_user_id, wishlistname) {
  if (!foreign_user_id || !wishlistname) {
    console.log({ foreign_user_id, wishlistname });
    throw new Error("foreign_user_id, wishlistname are required, Watch console log for more...");
  }
  return createDefaultWishlist;
}

/**
 * This function wants shop.t_users(email, password).
 * @param {string} email
 * @param {string} password
 */
function signUpUserQueryFunc(email, password) {
  if (!email || !password) {
    console.log({ email, password });
    throw new Error("email, password are required, Watch console log for more...");
  }
  return signUpUserQuery;
}

/**
 * This function wants t_productId.myProductId.
 * @param {number} productId
 */
function getSingleProductQueryFunc(productId) {
  if (!productId) {
    console.log({ productId });
    throw new Error("productId are required, Watch console log for more...");
  }
  return getSingleProductQuery;
}

module.exports = {
  signUpUserQueryFunc,
  createDefaultWishlistFunc,
  addProductToWishlistQueryFunc,
  addProductToCartQueryFunc,
  incrementCartCountQueryFunc,
  decrementCartCountQueryFunc,
  updateProductToCartQueryFunc,
  deleteProductToCartQueryFunc,
  checkProductExistInUserCartQueryFunc,
  checkUserExistQueryFunc,
  getUserCartDataQueryFunc,
  getUserDataQueryFunc,
  userLoginQueryFunc,
  getUserWishListNamesQueryFunc,
  getUserWishListNamesQueryWithLimitFunc,
  getUserWishListDataQueryFunc,
  getSingleProductQueryFunc,
};
