const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("***DATABASE CONNECTED***");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 300; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			author: "60c787264fe84731d464d01c",
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			description:
				"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Alias nam, magnam exercitationem sequi repellendus eveniet delectus perspiciatis atque deserunt quia voluptatum totam quaerat corrupti suscipit veniam minima! Autem, odit ducimus?",
			price,
			geometry: {
				type: "Point",
				coordinates: [
					cities[random1000].longitude,
					cities[random1000].latitude,
				],
			},
			images: [
				{
					url: "https://res.cloudinary.com/fedupnow/image/upload/v1624283840/YelpCamp/thumb-1920-600293_wsjzhr.jpg",
					filename: "YelpCamp/thumb-1920-600293_wsjzhr",
				},
				{
					url: "https://res.cloudinary.com/fedupnow/image/upload/v1624283830/YelpCamp/18621_i7y2dn.jpg",
					filename: "YelpCamp/18621_i7y2dn",
				},
			],
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
