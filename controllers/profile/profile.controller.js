const pool = require("../../db/db");

const createClub = async (req, res) => {
  const { name } = req.body;
  const admin_id = req.session.user_id;
  const query = "INSERT INTO club (name, admin_id) VALUES ($1, $2) RETURNING *";
  const value = [name, admin_id];
  try {
    const data = await pool.query(query, value);
    req.flash("success", "club created successfully");
    return res.render("pages/profile/create_club", {
      success: req.flash("success"),
      title: "create club",
    });
  } catch (err) {
    req.flash("error", "failed to create club");
    return res.render("pages/profile/create_club", {
      error: req.flash("error"),
      title: "create club",
    });
  }
};

const getUsersClubs = async (req, res) => {
  const id = req.session.user_id;
  const query = "SELECT * FROM club WHERE admin_id = ($1)";
  const value = [id];
  try {
    const data = await pool.query(query, value);
    return res.render("pages/profile", { title: "profile", data: data.rows });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

const createClubView = (req, res) => {
  res.render("pages/profile/create_club", { title: "create club" });
};

module.exports = {
  createClub,
  getUsersClubs,
  createClubView,
};
