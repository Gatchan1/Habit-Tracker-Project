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
  User.findOne({_id: req.session.currentUser._id})
  .populate("habits")
  .then((user) => {
      let data = user;
      res.render("profile", data);
  })
  .catch((err) => next(err))
});

router.get('/habit/create', isLoggedIn, (req, res, next) => {
    res.render('createHabit', {layout: 'layout'})
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
    return User.findByIdAndUpdate(req.session.currentUser._id, { $push: { habits: habit._id }})
    // return User.findById(req.session.currentUser._id)
  })
  
  .then((user) => {
    res.redirect('/profile');
    // let updatedHabit = user.habits.push(habit._id)
   })

  .then((userInfo) => {
      console.log(userInfo)
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


router.post("/habits/:habitId", (req, res, next) => {
  let habitId = req.params.habitId
  Habit.findOne({_id: habitId})
  .then((habit) => {
    let datesCompleted = habit.datesCompleted
    let now = DateTime.now().toISODate()
    datesCompleted.push(now)
    return Habit.findByIdAndUpdate(habitId, {datesCompleted}, {new: true})
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
