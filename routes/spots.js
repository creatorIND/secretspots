const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const {
	isLoggedIn,
	isAuthor,
	validateSpot,
	validateObjectId,
} = require("../middleware");

const spots = require("../controllers/spots");
const catchAsync = require("../utils/catchAsync");

router
	.route("/")
	.get(catchAsync(spots.showAllSpots))
	.post(
		isLoggedIn,
		upload.array("image"),
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
		upload.array("image"),
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
