function getSingleProductQuery(productId) {
  return {
    name: `fetch-single-product-${productId}`,
    text: `select 
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
        where t_productId.myProductId = $1;`,
    values: [productId],
  };
}
function signUpUserQuery(email, hasedPassword) {
  return {
    name: `sign-up-user-${email}`,
    text: `INSERT into shop.t_users(email, password) Values($1, $2) RETURNING id;`,
    values: [email, hasedPassword],
  };
}
function createDefaultWishlist(userId) {
  return {
    name: `default-wishList-${userId}`,
    text: `INSERT into shop.t_wishlist(foreign_user_id, wishlistname) Values($1, $2);`,
    values: [userId, "default"],
  };
}
function addProductToWishlist(userId, productId, wishListNameId) {
  return {
    name: `add-product-to-wishList-${userId}`,
    text: `INSERT into shop.t_wishlist_products(foreign_user_id, foreign_product_id, foreign_wishlist_id) Values($1, $2, $3);`,
    values: [userId, productId, wishListNameId],
  };
}
function addProductToCartQuery(productId, userId, cartName, quantity, price, shippingPrice, discount, selectedProperties, shippingDetails, selectedImageUrl) {
  return {
    name: `addProduct-to-cart-${productId}-${userId}-${cartName}`,
    text: `INSERT into shop.t_cart(foreign_product_id, foreign_user_id, cartName, quantity, price, shippingPrice, discount, selectedProperties, shippingDetails, selectedImageUrl) Values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id;`,
    values: [productId, userId, cartName, quantity, price, shippingPrice, discount, selectedProperties, shippingDetails, selectedImageUrl],
  };
}
function incrementCartCountQuery(userId) {
  return {
    name: `increment-cartCount-${userId}`,
    text: `UPDATE shop.t_users SET cartCount = cartCount + 1 WHERE id = $1;`,
    values: [userId],
  };
}
function decrementCartCountQuery(userId) {
  return {
    name: "decrement-cartCount",
    text: `UPDATE shop.t_users SET cartCount = cartCount - 1 WHERE id = $1;`,
    values: [userId],
  };
}
function updateProductToCartQuery(productId, userId, cartName, quantity, price, shippingPrice, discount, selectedProperties, shippingDetails, selectedImageUrl) {
  return {
    name: `updateProduct-to-cart-${productId}-${userId}-${cartName}`,
    text: `UPDATE shop.t_cart SET quantity = $1, price = $2, shippingPrice = $3, discount = $4, selectedProperties = $5, shippingDetails = $6, selectedImageUrl = $7 WHERE foreign_user_id = $8 and foreign_product_id = $9 and cartName = $10 RETURNING id;`,
    values: [quantity, price, shippingPrice, discount, selectedProperties, shippingDetails, selectedImageUrl, userId, productId, cartName],
  };
}
function deleteProductToCartQuery(productId, userId, cartId) {
  return {
    name: `deleteProduct-to-cart-${cartId}`,
    text: `DELETE from shop.t_cart WHERE foreign_product_id = $1 and foreign_user_id = $2 and id = $3 RETURNING id;`,
    values: [productId, userId, cartId],
  };
}
function checkProductExistInUserCartQuery(cartName, userId) {
  return {
    name: `check-product-exist-in-cart-${userId}-${cartName}`,
    text: `SELECT id from shop.t_cart WHERE cartName = $1 and foreign_user_id = $2;`,
    values: [cartName, userId],
  };
}
function checkUserExistQuery(email) {
  return {
    name: `check-user-exist-${email}`,
    text: `SELECT email from shop.t_users WHERE email = $1;`,
    values: [email],
  };
}
function getUserCartDataQuery(userId) {
  return {
    name: `user-cart-data-${userId}`,
    text: `SELECT 
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
    WHERE foreign_user_id = $1;`,
    values: [userId],
  };
}
function getUserDataQuery(userId) {
  return {
    name: `check-user-exist-${userId}`,
    text: `SELECT email from shop.t_users WHERE id = $1;`,
    values: [userId],
  };
}
function userLoginQuery(email) {
  return {
    name: `user-login-${email}`,
    text: `SELECT id, email, password from shop.t_users WHERE email = $1;`,
    values: [email],
  };
}
function getUserWishListNamesQuery(userId, limit = 5) {
  return {
    name: `user-wishlist-name-${userId}`,
    text: `SELECT ARRAY_AGG(wishlistname) as "wishListNames", ARRAY_AGG(id) as "wishListIds" from shop.t_wishList WHERE foreign_user_id = $1 GROUP BY foreign_user_id LIMIT $2;`,
    values: [userId, limit],
  };
}
function getUserWishListDataQuery(wishlist_id, limit = 5) {
  return {
    name: `user-wishlist-data-${wishlist_id}`,
    text: `
    SELECT     
    t_titles.title,
    t_wishlist_products.id as "wishListId",
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
    `,
    values: [wishlist_id, limit],
  };
}

module.exports = {
  getSingleProductQuery,
  signUpUserQuery,
  createDefaultWishlist,
  checkUserExistQuery,
  userLoginQuery,
  getUserDataQuery,
  checkProductExistInUserCartQuery,
  addProductToCartQuery,
  updateProductToCartQuery,
  incrementCartCountQuery,
  deleteProductToCartQuery,
  getUserCartDataQuery,
  getUserWishListNamesQuery,
  getUserWishListDataQuery,
};
