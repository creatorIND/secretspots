const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

const { cloudinary } = require("../cloudinary");

const Spot = require("../models/spot");

module.exports.showAllSpots = async (req, res) => {
	const spots = await Spot.find({});
	res.render("spots/all-spots", { spots });
};

module.exports.renderNewForm = (req, res) => {
	res.render("spots/new-spot");
};

module.exports.createSpot = async (req, res, next) => {
	const geoData = await geocoder
		.forwardGeocode({
			query: req.body.spot.location,
			limit: 1,
		})
		.send();
	const spot = new Spot(req.body.spot);
	spot.geometry = geoData.body.features[0].geometry;
	spot.images = req.files.map((f) => ({
		url: f.path,
		filename: f.filename,
	}));
	spot.author = req.user._id;
	await spot.save();
	req.flash("success", "Successfully created a new spot.");
	res.redirect(`/spots/${spot._id}`);
};

module.exports.showSpot = async (req, res) => {
	const spot = await Spot.findById(req.params.id)
		.populate({
			path: "reviews",
			populate: {
				path: "author",
			},
		})
		.populate("author");
	if (!spot) {
		req.flash("error", "Cannot find that spot.");
		return res.redirect("/spots");
	}
	console.log(spot);
	res.render("spots/view-spot", { spot });
};

module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params;
	const spot = await Spot.findById(id);
	if (!spot) {
		req.flash("error", "Cannot find that spot.");
		return res.redirect("/spots");
	}
	console.log(spot);
	res.render("spots/edit-spot", { spot });
};

module.exports.updateSpot = async (req, res) => {
	const { id } = req.params;
	const spot = await Spot.findByIdAndUpdate(id, {
		...req.body.spot,
	});
	const images = req.files.map((f) => ({
		url: f.path,
		filename: f.filename,
	}));
	spot.images.push(...images);
	await spot.save();
	if (req.body.deleteImages) {
		for (let filename of req.body.deleteImages) {
			await cloudinary.uploader.destroy(filename);
		}
		await spot.updateOne({
			$pull: { images: { filename: { $in: req.body.deleteImages } } },
		});
	}
	req.flash("success", "Spot successfully updated.");
	res.redirect(`/spots/${spot._id}`);
};

module.exports.deleteSpot = async (req, res) => {
	const { id } = req.params;
	await Spot.findByIdAndDelete(id);
	req.flash("success", "Spot successfully deleted.");
	res.redirect("/spots");
};
