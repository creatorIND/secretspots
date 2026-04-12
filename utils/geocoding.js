const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.geocodeLocation = async (location) => {
	const geoData = await geocoder
		.forwardGeocode({
			query: location,
			limit: 1,
		})
		.send();

	if (!geoData.body.features || geoData.body.features.length === 0) {
		throw new Error("Location not found. Please enter a valid location.");
	}

	return geoData.body.features[0].geometry;
};
