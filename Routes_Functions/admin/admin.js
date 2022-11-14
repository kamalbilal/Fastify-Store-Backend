async function admin(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "Kamal Admin" && password === "Admin Access") {
    res.setCookie("admin_access_cookie", "Kamal you now are have admin access!");
    return res.status(200).send({ admin: true });
  }
  return res.status(200).send({ admin: false });
}
module.exports = admin;
