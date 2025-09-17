if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ejs = require("ejs");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const helmet = require("helmet");
const passport = require("passport");
const localStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const MongoStore = require("connect-mongo");

const User = require("./models/user");
const userRoutes = require("./routes/users");
const spotRoutes = require("./routes/spots");
const reviewRoutes = require("./routes/reviews");

const ExpressError = require("./utils/ExpressError");
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
	dbName: "secretspots",
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("***DATABASE CONNECTED***");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", ejs.name);
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
	"/star-rating",
	express.static(
		path.join(__dirname, "node_modules", "star-rating.js", "dist")
	)
);
app.use(
	mongoSanitize({
		replaceWith: "_",
	})
);

const secret = process.env.SECRET || "thisshouldbeabettersecret!";

const store = MongoStore.create({
	mongoUrl: dbUrl,
	touchAfter: 24 * 3600,
	crypto: {
		secret,
	},
});

store.on("error", function (e) {
	console.log("SESSION STORE ERROR", e);
});

app.set("trust proxy", 1);
app.use(
	session({
		store,
		name: "session",
		secret,
		resave: false,
		saveUninitialized: true,
		cookie: {
			sameSite: true,
			httpOnly: true,
			secure: true,
			maxAge: 1000 * 60 * 60 * 24 * 7,
		},
	})
);
app.use(flash());

app.use(helmet());
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: [],
			connectSrc: [
				"'self'",
				"https://api.mapbox.com/",
				"https://events.mapbox.com/",
			],
			scriptSrc: ["'unsafe-inline'", "'self'", "https://api.mapbox.com/"],
			styleSrc: [
				"'self'",
				"'unsafe-inline'",
				"https://api.mapbox.com/",
				"https://fonts.googleapis.com/",
			],
			workerSrc: ["'self'", "blob:"],
			objectSrc: [],
			imgSrc: [
				"'self'",
				"blob:",
				"data:",
				"https://res.cloudinary.com/sujalsinha/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
			],
			fontSrc: ["'self'", "https://fonts.gstatic.com"],
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	if (!["/login", "/"].includes(req.originalUrl)) {
		req.session.returnTo = req.originalUrl;
	}
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

app.use("/", userRoutes);
app.use("/spots", spotRoutes);
app.use("/spots/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
	res.render("home");
});

app.all("*", (req, res, next) => {
	next(new ExpressError("Page not found.", 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	err.statusCode = statusCode;
	if (!err.message) err.message = "There was some unknown error.";
	res.status(statusCode).render("error", { err, title: "Error" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`SERVING ON PORT ${port}...`);
});
