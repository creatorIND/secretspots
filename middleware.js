const mongoose = require("mongoose");

const Spot = require("./models/spot");
const Review = require("./models/review");

const ExpressError = require("./utils/ExpressError");
const { spotSchema, reviewSchema } = require("./schemas");

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.flash("error", "You must be logged in first.");
		return res.redirect("/login");
	}
	next();
};

module.exports.validateObjectId = (req, res, next) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		req.flash("error", "Invalid ID.");
		return res.redirect("/spots");
	}
	next();
};

module.exports.validateSpot = (req, res, next) => {
	const { error } = spotSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(", ");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const spot = await Spot.findById(id);
	if (!spot.author.equals(req.user._id)) {
		req.flash("error", "You do not have permission to do that.");
		return res.redirect(`/spots/${id}`);
	}
	next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
	const { id, reviewId } = req.params;
	const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user._id)) {
		req.flash("error", "You do not have permission to do that.");
		return res.redirect(`/spots/${id}`);
	}
	next();
};

module.exports.validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(", ");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};
