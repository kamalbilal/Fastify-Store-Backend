// const { getUserCartData } = require("../db/db");
// const jwt = require("jsonwebtoken");
// const { jwtSecret } = require("../passwords");

// async function getUserCart(req, res) {
//   const cookie = req.unsignCookie(req.cookies["token"]).value;
//   // const cookie = req.body.cookie;
//   let userId = null;

//   if (!cookie) {
//     return res.status(404).send({ error: true, code: "Error Code 6" });
//   }
//   try {
//     userId = jwt.verify(cookie, jwtSecret);
//     userId = userId["id"];
//   } catch (error) {
//     console.log(error);
//     return res.status(404).send({ error: true, code: "Error Code 7" });
//   }
//   if (!userId) {
//     return res.status(404).send({ error: true, code: "Error Code 6" });
//   }

//   const userCartData = await getUserCartData(userId);
//   if (!userCartData) {
//     return res.status(404).send({ error: true, success: false, reason: "Something's wrong" });
//   }
//   return res.status(200).send({ error: false, success: true, cart: userCartData });
// }

// module.exports = getUserCart;
