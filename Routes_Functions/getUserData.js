const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../passwords");
const db = require("../db/db")

async function getUserData(req, res) {
    if (!req.cookies["token"]) {
        return res.status(200).send({ error: true, success: false, code: "user not logged in" })
    }
    const cookie = req.unsignCookie(req.cookies["token"]).value;
    if (!cookie) {
        return res.status(404).send({ error: true, success: false, code: "Error Code 6" });
    }
    let id = null
    try {
        id = jwt.verify(cookie, jwtSecret);
        id = id["id"];
    } catch (error) {
        console.log(error);
        return res.status(404).send({ error: true, success: false, code: "Error Code 7" });
    }
    if (!id) {
        return res.status(404).send({ error: true, success: false, code: "Error Code 6" });
    }


    const output = await db.getUserData(id)
    return res.send({ success: true, data: output })
    // if (output && output.rows.length === 1) {
    // } else {
    //     return res.send({ success: false, error: true, reason: "Unauthorize" })
    // }

}

module.exports = getUserData;
