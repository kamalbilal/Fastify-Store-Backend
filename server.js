const { cookieSignedSecret } = require("./passwords");
const path = require('path')
// const fastify = require("fastify")();
const fastify = require("fastify")({ logger: true });

// fastify.register(require('@fastify/static'), {
//   root: path.join(__dirname, 'public'),
//   prefix: '/public/', // optional: default '/'
// })
// fastify.register(require("@fastify/mongodb"), {
//   // force to close the mongodb connection when app stopped
//   // the default value is false
//   forceClose: true,

//   url: "mongodb://127.0.0.1:27017/Store",
// });
// fastify.register(require('@fastify/mysql'), {
//   promise: true,
//   connectionString: 'mysql://root@localhost/Shop'
// })

// fastify.ready(async () => {
//   const connection = await fastify.mysql.getConnection()
//   const [rows, fields] = await connection.query(
//     'SELECT * FROM t_titles',
//   )
//   connection.release()
//   console.log(rows);
// });

fastify.register(require("@fastify/cors"), {
  origin: ["http://localhost:3000", "http://localhost:3001"], //(Whatever your frontend url is)
  credentials: true, // <= Accept credentials (cookies) sent by the client
});

fastify.register(require("@fastify/cookie"), {
  secret: cookieSignedSecret, // for cookies signature
  parseOptions: {}, // options for parsing cookies
});

fastify.register(require("./AllRoutes"), {
  prefix: "/",
});

fastify.listen({ port: 8000 }, (err) => {
  if (err) throw err;
  console.log("Server running on port 8000");
});
