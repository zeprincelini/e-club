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
  const query_club_members = `
  SELECT user_account.user_id, first_name, last_name, email, activity
  FROM user_account 
  JOIN users_club 
  ON users_club.user_id = user_account.user_id 
  WHERE users_club.club_id = ($1)
  AND users_club.status = 'joined'
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
    });
  } catch (err) {
    req.flash("error", "failed to retrieve club");
    return res.redirect(`/club/${club_id}`);
  }
};

const addMember = async (req, res) => {
  const { email } = req.body;
  const { club_id } = req.params;
  if (!email) {
    req.flash("error", "enter a valid email");
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
    req.flash("success", "member invitation sent ");
    return res.redirect(`/club/${club_id}`);
  } catch (err) {
    req.flash("error", "failed to invite member");
    return res.redirect(`/club/${club_id}`);
  }
};

const removeMember = async (req, res) => {
  const { club_id, member_id } = req.params;
  const query = "DELETE FROM users_club WHERE user_id = ($1)";
  const value = [member_id];
  try {
    await pool.query(query, value);
    req.flash("success", "member removed successfully");
    return res.redirect(`/club/${club_id}`);
  } catch (err) {
    req.flash("error", "failed to remove member");
    return res.redirect(`/club/${club_id}`);
  }
};

const getActivityView = (req, res) => {
  res.render("pages/profile/activity", { title: "activity" });
};

const clubJoined = async (req, res) => {
  const query = `
  SELECT name from club 
  JOIN users_club on users_club.user_id = ($1) 
  WHERE club.club_id = users_club.club_id;
  `;
  const value = [req.session.user_id];
  try {
    const data = await pool.query(query, value);
    res.render("pages/profile/club_joined", {
      title: "joined clubs",
      data: data.rows,
    });
  } catch (err) {
    req.flash("error", "failed to retrieve clubs");
    res.redirect("/");
  }
};

const inviteView = async (req, res) => {
  const id = req.session.user_id;
  const query = `
  SELECT name, club.club_id FROM club 
  JOIN users_club ON club.club_id = users_club.club_id 
  WHERE users_club.user_id = ($1) 
  AND status = 'pending'
  `;
  const value = [id];
  try {
    const data = await pool.query(query, value);
    return res.render("pages/profile/invite", {
      title: "invites",
      data: data.rows,
    });
  } catch (err) {
    req.flash("error", "failed to retrieve invites");
    res.redirect("/");
  }
};

const acceptInvite = async (req, res) => {
  const { clubId } = req.params;
  const userId = req.session.user_id;
  const randomLog = Math.floor(Math.random() * 31);
  const query = `
    UPDATE users_club
    SET status = 'joined', activity = ($3)
    WHERE user_id = ($1)
    AND club_id = ($2)
  `;
  const value = [userId, clubId, randomLog];
  try {
    await pool.query(query, value);
    req.flash("success", "invite accepted");
    return res.redirect("/club-invites");
  } catch (err) {
    req.flash("error", "failed to accept invite");
    return res.redirect(`/club-invites`);
  }
};

const declineInvite = async (req, res) => {
  const { clubId } = req.params;
  const userId = req.session.user_id;
  const query = `
    DELETE FROM users_club
    WHERE user_id = ($1)
    AND club_id = ($2)
  `;
  const value = [userId, clubId];
  try {
    await pool.query(query, value);
    req.flash("success", "invite declined");
    return res.redirect("/club-invites");
  } catch (err) {
    req.flash("error", "failed to decline invite");
    return res.redirect(`/club-invites`);
  }
};

module.exports = {
  createClub,
  getUsersClubs,
  createClubView,
  getClubView,
  addMember,
  removeMember,
  getActivityView,
  clubJoined,
  inviteView,
  acceptInvite,
  declineInvite,
};
