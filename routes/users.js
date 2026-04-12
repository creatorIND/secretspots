const express = require("express");
const passport = require("passport");

const users = require("../controllers/users");
const { storeReturnTo, isNotLoggedIn } = require("../middleware");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

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

router.post("/logout", users.logout);

module.exports = router;
