function oneProductQuery(productId) {
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
        t_productId.productId as "productId",
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




module.exports = { oneProductQuery, signUpUserQuery, checkUserExistQuery, userLoginQuery, getUserDataQuery }