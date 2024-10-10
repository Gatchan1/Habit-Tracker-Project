const express = require("express");
const router = express.Router();
const isLoggedOut = require("../middleware/isLoggedOut");

/* GET home page */
router.get("/", isLoggedOut, (req, res, next) => {
  res.render("index", { layout: "layout2" });
});

module.exports = router;
