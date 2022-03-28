const pool = require("../../db/db");

const createClub = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    req.flash("error", "please enter a club name");
    return res.render("pages/profile/create_club", {
      error: req.flash("error"),
      title: "create club",
    });
  }
  const admin_id = req.session.user_id;
  const query = "INSERT INTO club (name, admin_id) VALUES ($1, $2) RETURNING *";
  const value = [name, admin_id];
  try {
    await pool.query(query, value);
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
    req.flash("error", "failed to retrieve club");
    return res.render("pages/profile", {
      error: req.flash("error"),
      title: "profile",
    });
  }
};

const createClubView = (req, res) => {
  res.render("pages/profile/create_club", { title: "create club" });
};

const getClubView = async (req, res) => {
  const club_id = req.params.id;
  const query = "SELECT * FROM club WHERE club_id = ($1)";
  const value = [club_id];
  const query_club_members = `select user_account.user_id, first_name, last_name, email from user_account join users_club on users_club.user_id = user_account.user_id WHERE users_club.club_id = ($1)
  `;
  const value_members = [club_id];
  try {
    const data = await pool.query(query, value);
    const members = await pool.query(query_club_members, value_members);
    res.render("pages/profile/club", {
      title: "club",
      data: data.rows[0],
      id: club_id,
      members: members.rows,
      msg: req.flash("info"),
    });
  } catch (err) {
    console.log(err.message);
    req.flash("error", "failed to retrieve club");
    return res.render("pages/profile/club", {
      error: req.flash("error"),
      title: "club",
    });
  }
};

const addMember = async (req, res) => {
  const { email } = req.body;
  const { club_id } = req.params;
  if (!email) {
    req.flash("info", "enter a valid email");
    res.locals.error = req.flash();
    return res.redirect(`/club/${club_id}`);
  }
  const emailQuery = "SELECT * FROM user_Account WHERE email = ($1)";
  const emailValue = [email];
  const query = "INSERT INTO users_club (user_id, club_id) VALUES ($1, $2)";
  try {
    const user = await pool.query(emailQuery, emailValue);
    const userId = user.rows[0];
    const value = [userId.user_id, club_id];
    await pool.query(query, value);
    req.flash("info", "member added successfully");
    res.locals.success = req.flash();
    return res.redirect(`/club/${club_id}`);
  } catch (err) {
    req.flash("info", "failed to add member");
    res.locals.error = req.flash();
    return res.redirect(`/club/${club_id}`);
  }
};

const removeMember = async (req, res) => {
  const { club_id, member_id } = req.params;
  const query = "DELETE FROM users_club WHERE user_id = ($1)";
  const value = [member_id];
  try {
    await pool.query(query, value);
    return res.redirect(`/club/${club_id}`);
  } catch (err) {
    return res.redirect(`/club/${club_id}`);
  }
};

getActivityView = (req, res) => {
  // req.flash("some", "something is amiss");
  // res.locals.test = req.flash();
  res.render("pages/profile/activity", { title: "activity" });
};

module.exports = {
  createClub,
  getUsersClubs,
  createClubView,
  getClubView,
  addMember,
  removeMember,
  getActivityView,
};
