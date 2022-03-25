const router = require("express").Router();
const controller = require("../../controllers/auth/auth");

router.post("/sign-in", controller.signIn);
router.post("/sign-up", controller.signUp);

module.exports = router;
