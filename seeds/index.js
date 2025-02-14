const mongoose = require("mongoose");
// const dBUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
const dBUrl = "mongodb://localhost:27017/secretspots";
const { faker } = require("@faker-js/faker");

const Spot = require("../models/spot");

mongoose.connect(dBUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("***DATABASE CONNECTED***");
});

const seedDB = async () => {
	await Spot.deleteMany({});

	for (let i = 0; i < 100; i++) {
		const spot = new Spot({
			author: "67ab62b3fa1ef31fece89213",
			location: faker.location.streetAddress({ useFullAddress: true }),
			name: `${faker.lorem.word()} ${faker.music.genre()}`,
			description: `${faker.lorem.sentences(6)}`.slice(0, 500),
			geometry: {
				type: "Point",
				coordinates: [
					faker.location.longitude(),
					faker.location.latitude(),
				],
			},
			// images: [
			// 	{
			// 		url: faker.image.urlLoremFlickr({
			// 			width: 1920,
			// 			height: 1080,
			// 			category: "nature",
			// 		}),
			// 		filename: "SecretSpots/vjbtkidqivlnhec7pnou",
			// 	},
			// 	{
			// 		url: faker.image.urlLoremFlickr({
			// 			width: 1920,
			// 			height: 1080,
			// 			category: "travel",
			// 		}),
			// 		filename: "SecretSpots/f5qdpmisslmai8okshmc",
			// 	},
			// ],
		});
		await spot.save();
	}
};

seedDB()
	.then(() => {
		mongoose.connection.close();
	})
	.catch((err) => {
		console.log(err.message);
	});
