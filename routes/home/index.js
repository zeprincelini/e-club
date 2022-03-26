const router = require("express").Router();
const helper = require("../../helper/token/isAuthenticated");

router.get("/", helper.isAuthenticated, (req, res) => {
  res.render("pages/home/index", { title: "home" });
});

module.exports = router;
