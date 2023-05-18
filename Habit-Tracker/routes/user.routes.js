const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
// Handles Luxon (time dates management)
const { DateTime } = require("luxon");

const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");
const logHabbit = require("../utils/logHabit");
const Habit = require("../models/Habit.model");
const retrieveChartData = require("../utils/retrieveChartData");
const tableArray = require("../utils/createPreview");

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "habit-pics",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

// const upload = multer ({dest: './public/uploads'})
const upload = multer({ storage });

/* GET user profile*/
//Should be protected to be accessed only by logged in user and only for user with username
router.get("/profile", isLoggedIn, (req, res, next) => {
  User.findOne({ _id: req.session.currentUser._id })
    .populate("habits")
    .then((user) => {
      // logHabbit(user);
      for (let i = 0; i < user.habits.length; i++) {
        j = user.habits[i].datesCompleted.length;
        let lastDate = user.habits[i].datesCompleted[j - 1];
        if (lastDate == DateTime.now().toISODate()) {
          user.habits[i].checked = "yes";
        }
      }
      //instead of user, adding an object containing the user's data with an array of 7 booleans containing lagged habit

      user.habits = user.habits.map((habit) => {
        habit.tableArray = tableArray(habit); //tableArray: tableArray(habit)
        return habit;
      });

      res.render("profile", user);
    })
    .catch((err) => next(err));
});

router.get("/getChartData", (req, res, next) => {
  let chartData = [];
  User.findOne({ _id: req.session.currentUser._id })
    .populate("habits")
    .then((user) => {
      let numHabits = Math.min(user.habits.length, 7);

      for (let i = 0; i < numHabits; i++) {
        chartData.push({ title: user.habits[i].title, dates: 0 });

        for (let j = 0; j < user.habits[i].datesCompleted.length; j++) {
          date = user.habits[i].datesCompleted[j];
          // console.log(`dates: `,DateTime.fromISO(date).ordinal)

          if (DateTime.now().ordinal - DateTime.fromISO(date).ordinal < 7) {
            chartData[i].dates++;
          }
        }
      }

      //WE could also put an if so that the first 6 days OF THE YEAR behave different
      // console.log("chartData:", chartData);

      let chartDataFormatted = {
        labels: chartData.map((habit) => habit.title),
        dates: chartData.map((habit) => habit.dates),
      };

      res.json(chartDataFormatted);
    });
});

// CREATE HABIT
// GET
router.get("/habit/create", isLoggedIn, (req, res, next) => {
  User.find()
    .then((users) => {
      res.render("createHabit", { layout: "layout", users });
    })
    .catch((err) => next(err));
});

// POST
router.post("/habit/create", isLoggedIn, (req, res, next) => {
  const { title, description } = req.body;
  let groupOfUsers = []
  //if we only add one user, it will be retrieved as a string, but if we add more than one it will be an array (typeof = object)
  if (req.body.groupOfUsers && typeof req.body.groupOfUsers == "string") {
    groupOfUsers = [req.body.groupOfUsers]
  }
  if (req.body.groupOfUsers && typeof req.body.groupOfUsers == "object") {
    groupOfUsers = req.body.groupOfUsers
  }

  const newHabit = {
    title,
    userId: req.session.currentUser._id,
    description,
    datesCompleted: [],
    groupOfUsers, // Array of User IDs
  };

  Habit.create(newHabit) // create the habit for current user
    .then((habit) => {
      console.log("New habit saved:", habit);
      return User.findByIdAndUpdate(req.session.currentUser._id, { $push: { habits: habit._id } }); // Connect habit to User document
    })
    .then(() => { // create a copy of the habit for the people chosen in the group
      if (req.body.groupOfUsers) {
        console.log("groupOfUsers: ", groupOfUsers)

        for (let i = 0; i < groupOfUsers.length; i++) {

          let externalUser = groupOfUsers[i]
          console.log("un user del grupo?: ", externalUser)

          let newHabitUsers = []
          for (let j = 0; j < groupOfUsers.length; j++) {
            if (groupOfUsers[j] != externalUser) {
              newHabitUsers.push(groupOfUsers[j])
            }
          }
          newHabitUsers.push(req.session.currentUser._id)

          let newExternalHabit = {
            title,
            userId: externalUser,
            description,
            datesCompleted: [],
            groupOfUsers: newHabitUsers
          }

          Habit.create(newExternalHabit) // Connect habit to User document
          .then((habit) => {
            return User.findByIdAndUpdate(habit.userId, { $push: { habits: habit._id } });
          })
          .then(() => console.log("Group habit completely created"))
          .catch((err) => next(err))
        }       
      }
    })
    .then(() => {
      res.redirect("/profile");
    })
    .catch((err) => {
      next(err);
    });
});

// PROFILE EDIT
// GET
router.get("/profile/edit", isLoggedIn, (req, res, next) => {
  User.findOne({ _id: req.session.currentUser })
    .then((user) => {
      // console.log(user);
      res.render("edit-profile", { user });
    })

    .catch((err) => {
      next(err);
    });
});

//POST
router.post("/profile/edit", isLoggedIn, upload.single("image"), (req, res, next) => {
  const editProfile = {
    username: req.body.username,
    email: req.body.email,
    bio: req.body.bio,
    profilePic: req.file.path,
  };
  console.log("###################", req.file);
  User.findOneAndUpdate({ _id: req.session.currentUser }, editProfile, { new: true })
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
router.get("/:username", (req, res, next) => {
  let { username } = req.params;
  User.findOne({ username })
    .then((user) => {
      res.render("public-profile", user);
    })
    .catch((err) => next(err));
});


router.post("/search", (req, res, next) => {
  const searchQuery = req.body.userSearch;
  console.log(searchQuery);

  User.find({ username: { $regex: searchQuery, $options: "i" } })
    .then((users) => {
      console.log("user response:", users);
      const username = users[0].username;
      res.redirect(`${username}`);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
