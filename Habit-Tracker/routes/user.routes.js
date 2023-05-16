const express = require('express');
const router = express.Router();
const User = require("../models/User.model");
// Handles Luxon (time dates management)
const { DateTime } = require("luxon")


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
    res.render('createHabit', {layout: 'layout2'})
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


router.get("/profile/edit", isLoggedIn, (req, res, next) => {
    User.findOne(req.session.currentUser)
    .then(user => {
        res.render("edit-profile", user)
    })
    .catch((err) => next(err))
})




router.post("/habit/:habitId", (req, res, next) => {
  let habitId = req.params.habitId
  Habit.findOne(habitId)
  .then((habit) => {
    let now = DateTime.now().toISODate()
    let newDatesCompleted = habit.datesCompleted.push(now)
    Habit.findByIdAndUpdate(habitId, {datesCompleted: newDatesCompleted}, { new: true })
  })
  .then((updatedHabit) => {
    console.log(updatedHabit)
    res.redirect("/profile")
  })
  .catch((err) => next(err))
})






////////////   TEST ROUTES!!!! only for testing   //////////////////////////

router.get("/testing", (req, res, next) => {
  const now = DateTime.now().toISODate();
  console.log("date: ", now)
  res.render("testing")
})

router.post("/testing", (req, res, next) => {
  let checkHabit = req.body
  console.log("cheeeeeeeeeeeeck: ", checkHabit)


  res.render("testing")
})

/////////////////////////////////////////




module.exports = router;
