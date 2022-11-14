const fastify = require("fastify")();

async function getSearchedProducts(req, res) {
  const connection = await fastify.mysql.getConnection()
  const [rows, fields] = await connection.query(
    'SELECT * FROM t_titles',
  )
  connection.release()
  return rows
}
module.exports = getSearchedProducts;
