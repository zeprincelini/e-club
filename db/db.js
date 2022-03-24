const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT,
});

pool
  .connect()
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

module.exports = pool;
