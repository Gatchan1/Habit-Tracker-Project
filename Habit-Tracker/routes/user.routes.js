const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
// Handles Luxon (time dates management)
const { DateTime } = require("luxon");

const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");
const logHabbit = require("../utils/logHabit");
const Habit = require("../models/Habit.model");
const retrieveChartData = require("../utils/retrieveChartData")
const tableArray = require('../utils/createPreview')

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

      //we need to create a copy of habits, one for Lisa's implementation to transform, and the other would be for retrieving my chart data. Both of them should go into the user object, and pass this user object to the render.


///////////////////////////////////////
//////// RETRIEVING CHART DATA ////////
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv      

let chartData = []
    User.findOne({ _id: req.session.currentUser._id })
    .populate("habits")
    .then((user) => {
        console.log("nowwww: ",DateTime.now().ordinal)

        if (user.habits.length < 7) {
            for (let i = 0; i < user.habits.length; i++) {
                // console.log("datesCompleted: ", user.habits[i].datesCompleted)                
                
                for (let j = 0; j < user.habits[i].datesCompleted.length; j++) {
                    date = user.habits[i].datesCompleted[j]
                    // console.log(`datessss: `,DateTime.fromISO(date).ordinal)

                    if ((DateTime.now().ordinal - DateTime.fromISO(date).ordinal) < 7 ) {
                        chartData[i].dates.push(DateTime.fromISO(date).ordinal)
                    }     

                }                            
            }

        } else {
            for (let i = 0; i < 7; i++) {  //different end condition of Outer For-Loop
                // console.log("datesCompleted: ", user.habits[i].datesCompleted)    
                // console.log("habiiiit: ",user.habits[i].title)
                chartData.push({title: user.habits[i].title, dates: []})            
                
                for (let j = 0; j < user.habits[i].datesCompleted.length; j++) {
                    date = user.habits[i].datesCompleted[j]
                    // console.log(`datessss: `,DateTime.fromISO(date).ordinal)

                    if ((DateTime.now().ordinal - DateTime.fromISO(date).ordinal) < 7 ) {
                        chartData[i].dates.push(DateTime.fromISO(date).ordinal)
                    }
                }                            
            }
        }

        chartData.forEach((habitData) => {
            habitData.chartDates = habitData.dates.length
        })

         // and also I have to compare the ordinals to "todays ordinal - 6", so that we only manage 7 days.
         //and also put an if so that the first 6 days OF THE YEAR behave slightly differentlyyy
         console.log("should workkk:", chartData)
         user.chartData = chartData
         user.arrayTest = ["habit1", "habit2", "habit3", "habit4", "habit5"]
         user.numberTest = [2,3,4,2,0]

        //  module.exports = user



         ////////////////////////////
         res.render("profile", user); ////////
         //////////////////////////////

    })
    .catch(err => console.log(err))

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^    
//////// RETRIEVING CHART DATA ////////
///////////////////////////////////////

//swap the other res.render with this one vvvv for Lisa's part to work.

      // res.render("profile", user);
    })
    .catch((err) => next(err));
});

router.get("/habit/create", isLoggedIn, (req, res, next) => {
  res.render("createHabit", { layout: "layout" });
});

router.post("/habit/create", (req, res, next) => {
  const { title, description, private, addUsers } = req.body;
  const newHabit = {
    title,
    userId: req.session.currentUser._id,
    description,
    datesCompleted: [],
    groupOfUsers: [], // Array of User IDs
    private,
  };
  Habit.create(newHabit)
  .then(habit => {
    console.log('New habit saved:', habit);
    return User.findByIdAndUpdate(req.session.currentUser._id, { $push: { habits: habit._id }})
    
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
    User.findOne(req.session.currentUser)
    .then(user => {
        res.render("edit-profile", user)
        
    })

    .then((user) => {
      res.redirect("/profile");
      // let updatedHabit = user.habits.push(habit._id)
    })

    .then((userInfo) => {
      console.log(userInfo);
    })

    .catch((err) => {
      next(err);
    });
});

router.get("/profile/edit", isLoggedIn, (req, res, next) => {
  User.findOne(req.session.currentUser)
    .then((user) => {
      res.render("edit-profile", user);
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
      res.redirect(`/${username}`);
    })
    .catch((err) => {
      next(err);
    });
});



module.exports = router;
