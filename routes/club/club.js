const router = require("express").Router();
const controller = require("../../controllers/club/club.controller");

router.post("/", controller.createClub);
router.get("/:id", controller.getUsersClubs);

module.exports = router;
