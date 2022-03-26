const router = require("express").Router();
const controller = require("../../controllers/auth/auth");
const helper = require("../../helper/token/isAuthenticated");

router.post("/sign-in", controller.signIn);
router.post("/sign-up", controller.signUp);

router.get("/sign-in", helper.isAuthorized, controller.signInView);
router.get("/sign-up", helper.isAuthorized, controller.signUpView);
router.get("/sign-out", controller.signOut);

module.exports = router;
