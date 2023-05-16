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

router.get('/group-list', isLoggedIn, (req, res, next) => {
    res.render('groupList', {layout: 'layout'})
})

router.get('/:id/habit', isLoggedIn, (req, res, next) => {
  res.render('groupHabit', {layout: 'layout'})
})


module.exports = router;
