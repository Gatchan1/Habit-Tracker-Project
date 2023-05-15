const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", {layout: '/layouts/layout2'});
});

module.exports = router;
