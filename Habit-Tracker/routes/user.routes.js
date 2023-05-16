const express = require('express');
const router = express.Router();
const User = require("../models/User.model");


const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");
const Habit = require('../models/Habit.model');

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

router.get('/habit/create', (req, res, next) => {
    res.render('createHabit', {layout: 'layouts/layout2'})
})

router.post('/habit/create', (req, res, next) => {
    const {title, description, private, addUsers} = req.body
    const newHabit = {
        title,
        userId: req.session.currentUser._id,
        description,
        datesCompleted: [],
        groupOfUsers: [], // Array of User IDs
        private
      }
    Habit.create(newHabit)
      .then(habit => {
        console.log('New habit saved:', habit);
        res.redirect('/profile');
      })
          
      .catch(err => {
        next(err)
      })
    })  


router.get(":username/profile/edit", isLoggedIn, (req, res, next) => {
    User.findOne(req.session.currentUser)
    .then(user => {
        res.render("edit-profile", user)
    })
    .catch((err) => next(err))
})

module.exports = router;
