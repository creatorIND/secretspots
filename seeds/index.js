if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const mongoose = require("mongoose");
const Spot = require("../models/spot");
const dBUrl = process.env.DB_URL;

const initialSpots = require("./initialSpots");

mongoose.connect(dBUrl, { dbName: "secretspots" });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("***DATABASE CONNECTED***");
});

const seedDB = async () => {
	await Spot.deleteMany({});

	for (let el of initialSpots) {
		const spot = new Spot({
			author: "6703d2482b6d7b7da90667b6",
			location: el.location,
			name: el.name,
			description: el.description,
			geometry: el.geometry,
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
