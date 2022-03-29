const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
});

pool
  .connect()
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

module.exports = pool;
