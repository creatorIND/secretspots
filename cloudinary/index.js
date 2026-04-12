const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "SecretSpots",
	},
});

const upload = multer({
	storage,
	limits: {
		fileSize: 5 * 1024 * 1024,
		files: 5,
	},
	fileFilter: (req, file, cb) => {
		const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
		if (ALLOWED_TYPES.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(
				new Error(
					"Invalid file type. Only JPG, JPEG, and PNG files are allowed."
				),
				false
			);
		}
	},
});

module.exports = {
	cloudinary,
	storage,
	upload,
};
