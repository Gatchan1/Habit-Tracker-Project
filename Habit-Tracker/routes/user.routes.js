const express = require('express');
const router = express.Router();
const User = require("../models/User.model");


const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");

/* GET user profile*/
//Should be protected to be accessed only by logged in user and only for user with username
router.get("/profile", isLoggedIn, (req, res, next) => {
    User.findOne(req.session.currentUser)
    .then((user) => {
        let data = user;
        console.log(data)
        res.render("profile", data);
    })
});

module.exports = router;
