function getSingleProductQuery(productId) {
  return {
    name: 'fetch-single-product',
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
        where t_productId.productId = $1;`,
    values: [productId],
  }

}
function signUpUserQuery(email, hasedPassword) {
  return {
    name: 'sign-up-user',
    text: `INSERT into shop.t_users(email, password) Values($1, $2) RETURNING id;`,
    values: [email, hasedPassword],
  }

}
function addProductToCartQuery(productId, userId, cartName, quantity, price, shippingPrice, discount, selectedProperties, shippingDetails) {
  return {
    name: 'addProduct-to-cart',
    text: `INSERT into shop.t_cart(foreign_product_id, foreign_user_id, cartName, quantity, price, shippingPrice, discount, selectedProperties, shippingDetails) Values($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id;`,
    values: [productId, userId, cartName, quantity, price, shippingPrice, discount, selectedProperties, shippingDetails],
  }

}
function incrementCartCountQuery(userId) {
  return {
    name: 'increment-cartCount',
    text: `UPDATE shop.t_users SET cartCount = cartCount + 1 WHERE id = $1;`,
    values: [userId],
  }

}
function decrementCartCountQuery(userId) {
  return {
    name: 'decrement-cartCount',
    text: `UPDATE shop.t_users SET cartCount = cartCount - 1 WHERE id = $1;`,
    values: [userId],
  }

}
function updateProductToCartQuery(productId, userId, cartName, quantity, price, shippingPrice, discount, selectedProperties, shippingDetails) {
  return {
    name: 'updateProduct-to-cart',
    text: `UPDATE shop.t_cart SET quantity = $1, price = $2, shippingPrice = $3, discount = $4, selectedProperties = $5, shippingDetails = $6 WHERE foreign_user_id = $7 and foreign_product_id = $8 and cartName = $9 RETURNING id;`,
    values: [quantity, price, shippingPrice, discount, selectedProperties, shippingDetails, userId, productId, cartName],
  }

}
function deleteProductToCartQuery(productId, userId, cartId) {
  return {
    name: 'deleteProduct-to-cart',
    text: `DELETE from shop.t_cart WHERE foreign_product_id = $1 and foreign_user_id = $2 and id = $3 RETURNING id;`,
    values: [productId, userId, cartId],
  }

}
function checkProductExistInUserCartQuery(cartName, userId) {
  return {
    name: 'check-product-exist-in-cart',
    text: `SELECT id from shop.t_cart WHERE cartName = $1 and foreign_user_id = $2;`,
    values: [cartName, userId],
  }
}
function checkUserExistQuery(email) {
  return {
    name: 'check-user-exist',
    text: `SELECT email from shop.t_users WHERE email = $1;`,
    values: [email],
  }
}
function getUserDataQuery(id) {
  return {
    name: 'check-user-exist',
    text: `SELECT email from shop.t_users WHERE id = $1;`,
    values: [id],
  }

}
function userLoginQuery(email) {
  return {
    name: 'check-user-exist',
    text: `SELECT id, email, password from shop.t_users WHERE email = $1;`,
    values: [email],
  }

}




module.exports = { getSingleProductQuery, signUpUserQuery, checkUserExistQuery, userLoginQuery, getUserDataQuery, checkProductExistInUserCartQuery, addProductToCartQuery, updateProductToCartQuery, incrementCartCountQuery, deleteProductToCartQuery }