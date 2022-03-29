const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../../db/db");

const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    if (!hash) {
      req.flash("error", "failed to sign up");
      return res.redirect("/auth/sign-up");
    }
    const checkEmail = await pool.query(
      "SELECT * FROM user_account WHERE email = ($1)",
      [email]
    );
    if (checkEmail.rows.length !== 0) {
      req.flash("error", "Email already exists");
      return res.redirect("/auth/sign-up");
    }
    const query =
      "INSERT INTO user_account (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [firstName, lastName, email, hash];
    await pool.query(query, values);
    return res.redirect("/auth/sign-in");
  } catch (err) {
    req.flash("error", "failed to sign up");
    return res.redirect("/auth/sign-up");
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM user_account WHERE email = ($1)";
  const value = [email];
  try {
    const user = await pool.query(query, value);
    const data = user.rows;
    if (data.length === 0) {
      req.flash("error", "email does not exist");
      return res.redirect("/auth/sign-in");
    }
    const isPasswordValid = await bcrypt.compare(password, data[0].password);
    if (!isPasswordValid) {
      req.flash("error", "email or password incorrect");
      return res.redirect("/auth/sign-in");
    }
    // const fullName = [data[0].first_name, data[0].last_name].join(" ");
    // const token = jwt.sign(
    //   { email: data[0].email, name: fullName },
    //   process.env.SECRET
    // );
    req.session.isAuthenticated = true;
    req.session.user_id = data[0].user_id;
    res.redirect("/");
  } catch (err) {
    req.flash("error", "email or password incorrect");
    return res.redirect("/auth/sign-in");
  }
};

const signOut = (req, res) => {
  req.session.isAuthenticated = false;
  res.redirect("/");
};

const signInView = (req, res) => {
  res.render("pages/auth/sign_in", { title: "sign in" });
};

const signUpView = (req, res) => {
  res.render("pages/auth/sign_up", { title: "sign up" });
};

module.exports = {
  signIn,
  signUp,
  signOut,
  signInView,
  signUpView,
};
