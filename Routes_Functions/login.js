const { userLogin } = require("../db/db");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../passwords");
const bcrypt = require("bcrypt");

async function login(req, res) {
  const email = req.body.email;
  let password = req.body.password;
  if (!email || !password) {
    return res.status(404).send({ error: true, success: false, reason: "Invalid params" });
  }
  
  const user = await userLogin(email);
  if (user.rows.length === 0) {
    return res.status(401).send({ error: true, success: false, reason: "Credentials Error 1" });
  }
  const validPassword = await bcrypt.compare(password, user["rows"][0]["password"]);
  if (!validPassword) {
    return res.status(401).send({ error: true, success: false, reason: "Credentials Error" });
  }
  const token = jwt.sign({ id: user["rows"][0]["id"] }, jwtSecret, { expiresIn: "240h" });
  console.log(token);
  res.setCookie("token", token, {
    httpOnly: true,
    maxAge: 240 * 60 * 60 * 1000, // expires in 240 hours
    signed: true,
  });
  return res.status(200).send({ error: false, success: true, email });
}

module.exports = login;
