const { Pool, types } = require("pg");

types.setTypeParser(types.builtins.INT8, (value) => {
  return parseInt(value);
});

types.setTypeParser(types.builtins.FLOAT8, (value) => {
  return parseFloat(value);
});

types.setTypeParser(types.builtins.NUMERIC, (value) => {
  return parseFloat(value);
});

const pool = new Pool({
  user: "postgres",
  password: "Kamal1675.",
  host: "localhost",
  port: 5432,
  database: "shop",
  max: 5,
});

async function query(preparedStatement, values) {
  let res;
  try {
    res = await preparedStatement.execute(values);
  } catch (e) {
    console.log(e);
    res = {rows: null, fields: null}
  }
  return { rows: res.rows, fields: res.fields };
}

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
});
pool.on("disconnect", (err, client) => {
  console.log("...Db Disconnected...");
});

module.exports = { query, pool };
