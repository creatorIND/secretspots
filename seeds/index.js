const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Spot = require("../models/spot");
// const dBUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
const dBUrl = "mongodb://localhost:27017/secretspots";

mongoose.connect(dBUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("***DATABASE CONNECTED***");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Spot.deleteMany({});
	for (let i = 0; i < 300; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		// const price = Math.floor(Math.random() * 20) + 10;
		const spot = new Spot({
			author: "6683a7812a446e9af6b9b282",
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			description:
				"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Alias nam, magnam exercitationem sequi repellendus eveniet delectus perspiciatis atque deserunt quia voluptatum totam quaerat corrupti suscipit veniam minima! Autem, odit ducimus?",
			// price,
			geometry: {
				type: "Point",
				coordinates: [
					cities[random1000].longitude,
					cities[random1000].latitude,
				],
			},
			images: [
				{
					url: "https://res.cloudinary.com/fedupnow/image/upload/v1717758688/YelpCamp/vjbtkidqivlnhec7pnou.jpg",
					filename: "YelpCamp/vjbtkidqivlnhec7pnou",
				},
				{
					url: "https://res.cloudinary.com/fedupnow/image/upload/v1717758687/YelpCamp/f5qdpmisslmai8okshmc.jpg",
					filename: "YelpCamp/f5qdpmisslmai8okshmc",
				},
			],
		});
		await spot.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
