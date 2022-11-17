const getProductData = require("./Routes_Functions/getProductData");
const signUp = require("./Routes_Functions/signUp");
const login = require("./Routes_Functions/login");
const addToCart = require("./Routes_Functions/addToCart");
const getUserData = require("./Routes_Functions/getUserData");
const logout = require("./Routes_Functions/logout");
// const getSearchedProducts = require("./Routes_Functions/getSearchedProducts");
const getSearchedProducts = require("./Routes_Functions/customQuery");

// admin start
const admin = require("./Routes_Functions/admin/admin");
const createNewOffers = require("./Routes_Functions/admin/createNewOffers");
const getAllOffers = require("./Routes_Functions/admin/getAllOffers");
const getAllProducts = require("./Routes_Functions/admin/getAllProducts");
const addOffer = require("./Routes_Functions/admin/addOffer");
const getOfferData = require("./Routes_Functions/admin/getOfferData");
const deleteOffer = require("./Routes_Functions/admin/deleteOffer");
const removeProductFromOffer = require("./Routes_Functions/admin/removeProductFromOffer");
const offerToggle = require("./Routes_Functions/admin/offerToggle");
const renameOffer = require("./Routes_Functions/admin/renameOffer");
// admin end

module.exports = function (fastify, opts, done) {
  fastify.post("/getProductData", getProductData); // done
  fastify.post("/signup", signUp);
  fastify.post("/login", login);
  fastify.post("/getUserData", getUserData);
  fastify.post("/logout", logout);
  fastify.post("/addtocart", addToCart);
  // fastify.post("/getsearchedproducts", getSearchedProducts);

  // admin start
  fastify.post("/admin", admin);
  fastify.post("/createnewoffers", createNewOffers);
  fastify.get("/getalloffers", getAllOffers);
  fastify.post("/getallproducts", getAllProducts);
  fastify.post("/addoffer", addOffer);
  fastify.post("/getofferdata", getOfferData);
  fastify.post("/deleteoffer", deleteOffer);
  fastify.post("/removeproductfromoffer", removeProductFromOffer);
  fastify.post("/offertoggle", offerToggle);
  fastify.post("/renameoffer", renameOffer);
  // admin end

  done();
};

//   fastify.post("/getProductData", { preHandler: [pwd_middleware] }, handler_v1);
