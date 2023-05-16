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
    .catch((err) => next(err))
});

router.get("/profile/edit", isLoggedIn, (req, res, next) => {
    User.findOne(req.session.currentUser)
    .then(user => {
        res.render("edit-profile", user)
    })
    .catch((err) => next(err))
})

module.exports = router;
