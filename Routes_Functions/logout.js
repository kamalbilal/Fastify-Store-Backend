async function logout(req, res) {
    if (!req.cookies["token"]) {
        return res.status(404).send({ error: true, success: false, code: "Error Code 9" })
    }
    res.clearCookie("token")
    res.status(200).send({success: true})


}

module.exports = logout;
