const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
	res.render("users/register", { title: "Register" });
};

module.exports.register = async (req, res, next) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (err) => {
			if (err) {
				return next(err);
			}
			req.flash(
				"success",
				"SecretSpots welcomes you! Your contribution will be appreciated."
			);
			res.redirect("/spots");
		});
	} catch (e) {
		if (e.code && e.code === 11000) {
			req.flash(
				"error",
				"A user with the given email is already registered"
			);
		} else {
			req.flash("error", e.message);
		}
		res.redirect("/register");
	}
};

module.exports.renderLogin = (req, res) => {
	res.render("users/login", { title: "Login" });
};

module.exports.login = async (req, res) => {
	const redirectUrl = req.session.returnTo || "/spots";
	delete req.session.returnTo;
	req.flash("success", "Oh hey, welcome back!");
	res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		req.flash("success", "You have been successfully logged out!");
		res.redirect("/login");
	});
};
