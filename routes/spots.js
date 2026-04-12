const express = require("express");

const {
	isLoggedIn,
	isAuthor,
	validateSpot,
	validateObjectId,
	handleImageUpload,
} = require("../middleware");
const spots = require("../controllers/spots");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

router
	.route("/")
	.get(catchAsync(spots.showAllSpots))
	.post(
		isLoggedIn,
		handleImageUpload,
		validateSpot,
		catchAsync(spots.createSpot)
	);

router.get("/new", isLoggedIn, spots.renderNewForm);

router
	.route("/:id")
	.get(validateObjectId, catchAsync(spots.showSpot))
	.put(
		isLoggedIn,
		isAuthor,
		handleImageUpload,
		validateSpot,
		catchAsync(spots.updateSpot)
	)
	.delete(isLoggedIn, isAuthor, catchAsync(spots.deleteSpot));

router.get(
	"/:id/edit",
	validateObjectId,
	isLoggedIn,
	isAuthor,
	catchAsync(spots.renderEditForm)
);

module.exports = router;
