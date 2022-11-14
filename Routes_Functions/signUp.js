// const { v4: uuidv4 } = require("uuid");
const { checkUserExist, signUpUser } = require("../db/db");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../passwords");
const bcrypt = require("bcrypt");

async function signUp(req, res) {
  
  const email = req.body.email;
  let password = req.body.password;

  if (email && password) {
    const userAlreadyExist = await checkUserExist(email);
    if (userAlreadyExist["rows"].length > 0) {
      return res.status(409).send({ error: true, success: false, reason: "Email already exist." });
    }
    // const id = uuidv4();

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const insert = await signUpUser(email, password);
    if (insert["rows"][0].hasOwnProperty("id")) {
      const token = jwt.sign({ id: insert["rows"][0]["id"] }, jwtSecret, { expiresIn: "240h" });
      res.setCookie("token", token, {
        httpOnly: true,
        maxAge: 240 * 60 * 60 * 1000, // expires in 240 hours
        signed: true,
      });
      return res.status(201).send({ error: false, success: true, email });
    }
  } else {
    return res.status(404).send({ error: true, code: "Error Code 6" });
  }
}

module.exports = signUp;
