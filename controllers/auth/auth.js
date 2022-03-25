const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../../db/db");

const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    if (!hash) {
      return res.status(403).json({ error: "error creating account" });
    }
    const query =
      "INSERT INTO user_account (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [firstName, lastName, email, hash];
    const data = await pool.query(query, values);
    return res.status(200).json({ status: "success", data: data.rows });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM user_account WHERE email = ($1)";
  const value = [email];
  try {
    const user = await pool.query(query, value);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "email does not exist" });
    }
    // const isPasswordValid = await bcrypt.compare(password)
    return res.status(200).json({ user });
  } catch (err) {
    return res
      .status(401)
      .json({ status: "error", message: "email or password incorrect" });
  }
};

module.exports = {
  signIn,
  signUp,
};
