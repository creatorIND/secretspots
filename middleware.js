const mongoose = require("mongoose");

const Spot = require("./models/spot");
const Review = require("./models/review");

const { upload } = require("./cloudinary");
const ExpressError = require("./utils/ExpressError");
const { spotSchema, reviewSchema } = require("./schemas");

module.exports.storeReturnTo = (req, res, next) => {
	if (req.session.returnTo) {
		res.locals.returnTo = req.session.returnTo;
	}
	next();
};

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.flash("error", "You must be logged in first.");
		return res.redirect("/login");
	}
	next();
};

module.exports.isNotLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		req.flash("error", "You are already logged in!");
		return res.redirect("/spots");
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

module.exports.handleImageUpload = (req, res, next) => {
	const uploadProcess = upload.array("image");

	uploadProcess(req, res, (err) => {
		if (err) {
			let errorMessage = err.message;

			if (err.code === "LIMIT_FILE_SIZE")
				errorMessage =
					"Please ensure each image size does not exceed 5MB.";
			if (err.code === "LIMIT_FILE_COUNT")
				errorMessage =
					"You can only upload a maximum of 5 images at a time.";

			req.flash("error", errorMessage);

			let redirectPath = "/spots/new";
			if (req.method === "PUT" && req.params.id) {
				redirectPath = `/spots/${req.params.id}/edit`;
			}

			return req.session.save(() => {
				res.redirect(redirectPath);
			});
		}

		next();
	});
};
