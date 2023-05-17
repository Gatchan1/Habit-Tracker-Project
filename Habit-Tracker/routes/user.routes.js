const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
// Handles Luxon (time dates management)
const { DateTime } = require("luxon");

const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");
const logHabbit = require("../utils/logHabit");
const Habit = require("../models/Habit.model");
const tableArray = require('../utils/createPreview')


const multer = require('multer');
const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'habit-pics',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  },
});

// const upload = multer ({dest: './public/uploads'})
const upload = multer ({storage})

/* GET user profile*/
//Should be protected to be accessed only by logged in user and only for user with username
router.get("/profile", isLoggedIn, (req, res, next) => {
  User.findOne({ _id: req.session.currentUser._id })
    .populate("habits")
    .then((user) => {
        // logHabbit(user);
      for (let i = 0; i < user.habits.length; i++) {
        j = user.habits[i].datesCompleted.length
        let lastDate = user.habits[i].datesCompleted[j-1]
        if (lastDate == DateTime.now().toISODate()) {
          user.habits[i].checked = "yes";
        }
      }

      //instead of user, adding an object containing the user's data with an array of 7 booleans containing lagged habit
      
      user.habits = user.habits.map(habit => {
        habit.tableArray = tableArray(habit) //tableArray: tableArray(habit)
        return habit;
      })
      res.render("profile", user);
    })
    .catch((err) => next(err));
});

router.get("/habit/create", isLoggedIn, (req, res, next) => {
  User.find()
.then(users => {
  
  res.render("createHabit", { layout: "layout" , users});
  
})
.catch(err => next(err))
});

router.post("/habit/create", isLoggedIn, (req, res, next) => {
  const { title, description } = req.body;

  const newHabit = {
    title,
    userId: req.session.currentUser._id,
    description,
    datesCompleted: [],
    groupOfUsers: [], // Array of User IDs
  };

User.find()
.then(users => {
  const data = {};
  data.users = users
  return Habit.create(newHabit)
})

  .then(habit => {
    console.log('New habit saved:', habit);
    return User.findByIdAndUpdate(req.session.currentUser._id, { $push: { habits: habit._id }})
  })
  .then(resp => {
    return User.find()
  })
  .then(() => {
    res.redirect('/profile');
   })

  .then((userInfo) => {
      console.log(userInfo)
     }) 

  .catch(err => {
    next(err)
   })
  })  


router.get("/profile/edit", isLoggedIn, (req, res, next) => {
    User.findOne({_id: req.session.currentUser})
    .then(user => {
        console.log(user);
        res.render("edit-profile", {user})
        
    })
  
    .catch((err) => {
      next(err);
    });
  });
  
  router.post("/profile/edit", isLoggedIn, upload.single('image'), (req, res, next) => {
    const editProfile = {
     username: req.body.username,
     email: req.body.email,
     bio: req.body.bio,
    profilePic: req.file.path
  };
    console.log("###################", req.file)
    User.findOneAndUpdate({_id: req.session.currentUser}, editProfile, {new: true})
    .then(() => {
      res.redirect("/profile");
    })
    
    .catch((err) => next(err));
});

router.post("/habits/:habitId", (req, res, next) => {
  let habitId = req.params.habitId;
  Habit.findOne({ _id: habitId })
    .then((habit) => {
      let datesCompleted = habit.datesCompleted;
      let now = DateTime.now().toISODate();
      datesCompleted.push(now);
      return Habit.findByIdAndUpdate(habitId, { datesCompleted }, { new: true });
    })
    .then((updatedHabit) => {
      console.log(updatedHabit);
      res.redirect("/profile");
    })
    .catch((err) => next(err));
});

//Route to other users' public profiles
router.get('/:username', (req, res, next) => {
   let {username} = req.params;
    User.findOne({username})
    .then((user) => {
      res.render("public-profile", user);
    })
    .catch((err) => next(err));
});

////////////   TEST ROUTES!!!! only for testing   //////////////////////////

router.get("/testing", (req, res, next) => {
  const now = DateTime.now().toISODate();
  console.log("date: ", now);
  res.render("testing");
});

router.post("/testing", (req, res, next) => {
  let checkHabit = req.body
  console.log("cheeeeeeeeeeeeck: ", checkHabit)

  
  res.render("testing")
})
/////////////////////////////////////////


router.post('/search', (req, res, next) => {
  const searchQuery = req.body.userSearch; 
  console.log(searchQuery)

  User.find({ username: { $regex: searchQuery, $options: 'i' } })
    .then((users) => {
      console.log('user response:', users);
      const username = users[0].username
      res.redirect(`${username}`);
    })
    .catch((err) => {
      next(err);
    });
});



module.exports = router;
