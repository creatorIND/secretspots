const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const users = require("../controllers/users");
const passport = require("passport");

const { storeReturnTo, isNotLoggedIn } = require("../middleware");
router
	.route("/register")
	.get(isNotLoggedIn, users.renderRegister)
	.post(isNotLoggedIn, catchAsync(users.register));

router
	.route("/login")
	.get(isNotLoggedIn, users.renderLogin)
	.post(
		isNotLoggedIn,
		storeReturnTo,
		passport.authenticate("local", {
			failureFlash: true,
			failureRedirect: "/login",
		}),
		users.login
	);

router.get("/logout", users.logout);

module.exports = router;
