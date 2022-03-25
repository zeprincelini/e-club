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
    const checkEmail = await pool.query(
      "SELECT * FROM user_account WHERE email = ($1)",
      [email]
    );
    if (checkEmail.rows.length !== 0) {
      return res.status(401).json({ error: "email already exists" });
    }
    const query =
      "INSERT INTO user_account (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [firstName, lastName, email, hash];
    const data = await pool.query(query, values);
    return res
      .status(200)
      .json({ status: "success", data: data.rows })
      .render("pages/home/index", { token: accessToken });
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
    const data = user.rows;
    if (data[0] === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "email does not exist" });
    }
    const isPasswordValid = await bcrypt.compare(password, data[0].password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: "error", message: "email or password incorrect" });
    }
    const fullName = [data[0].first_name, data[0].last_name].join(" ");
    const token = jwt.sign(
      { email: data[0].email, name: fullName },
      process.env.SECRET
    );
    return res.status(200).json({
      status: "success",
      message: "sign in successful",
      accessToken: token,
    });
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
