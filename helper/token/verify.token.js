const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (header) {
    const token = header.split(" ")[1];
    jwt.verify(token, process.env.SECRET, (err, user) => {
      if (err) {
        return res.status("403").json({ error: err });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status("401").json({ error: "header missing" });
  }
};

module.exports = verifyToken;
