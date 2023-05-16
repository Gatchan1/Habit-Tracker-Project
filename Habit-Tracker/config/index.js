// We reuse this import in order to have access to the `body` property in requests
const express = require("express");

// ℹ️ Responsible for the messages you see in the terminal as requests are coming in
// https://www.npmjs.com/package/morgan
const logger = require("morgan");

// ℹ️ Needed when we deal with cookies (we will when dealing with authentication)
// https://www.npmjs.com/package/cookie-parser
const cookieParser = require("cookie-parser");

// ℹ️ Serves a custom favicon on each request
// https://www.npmjs.com/package/serve-favicon
const favicon = require("serve-favicon");

// ℹ️ global package used to `normalize` paths amongst different operating systems
// https://www.npmjs.com/package/path
const path = require("path");

// ℹ️ Session middleware for authentication
// https://www.npmjs.com/package/express-session
const session = require("express-session");

// ℹ️ MongoStore in order to save the user session in the database
// https://www.npmjs.com/package/connect-mongo
const mongoStore = require("connect-mongo");

// Connects the mongo uri to maintain the same naming structure
const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/habit-tracker"; //lowercased

// Middleware configuration
module.exports = (app) => {
  // In development environment the app logs
  app.use(logger("dev"));

  // To have access to `body` property in the request
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Normalizes the path to the views folder
  app.set("views", path.join(__dirname, "..", "views"));
  // Sets the view engine to handlebars
  app.set("view engine", "hbs");
  // AHandles access to the public folder
  app.use(express.static(path.join(__dirname, "..", "public")));

  // Handles access to the favicon
  app.use(
    favicon(path.join(__dirname, "..", "public", "images", "favicon.ico"))
  );

  // ℹ️ Middleware that adds a "req.session" information and later to check that you are who you say you are 😅
  app.set("trust proxy", 1); // Previously we didn't have the cookie object (Raquel)
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: {
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true
        },
        store: mongoStore.create({mongoUrl:process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/habit-tracker"}) // I changed this route here (Raquel)
    }));
};
