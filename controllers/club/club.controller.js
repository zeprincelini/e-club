const pool = require("../../db/db");

const createClub = async (req, res) => {
  const { name, admin_id } = req.body;
  const query = "INSERT INTO club (name, admin_id) VALUES ($1, $2) RETURNING *";
  const value = [name, admin_id];
  try {
    const data = await pool.query(query, value);
    return res.status(200).json({
      status: "success",
      message: "club created successfully",
      data: data.rows,
    });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

const getUsersClubs = async (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM club WHERE admin_id = ($1)";
  const value = [id];
  try {
    const data = await pool.query(query, value);
    return res.status(200).json({
      status: "success",
      data: data.rows,
    });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

module.exports = {
  createClub,
  getUsersClubs,
};
