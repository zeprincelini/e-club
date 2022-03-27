const router = require("express").Router();
const controller = require("../../controllers/profile/profile.controller");
const helper = require("../../helper/checkAuth/isAuthenticated");

router.post("/create-club", controller.createClub);
router.get("/create-club", helper.isAuthenticated, controller.createClubView);
router.get("/club/:id", helper.isAuthenticated, controller.getClubView);
router.post("/club/:club_id", helper.isAuthenticated, controller.addMember);
router.get("/", helper.isAuthenticated, controller.getUsersClubs);

module.exports = router;
