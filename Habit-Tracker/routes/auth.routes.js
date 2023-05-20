const express = require("express");
const router = express.Router();

const transporter = require("../config/transporter.config");

// ℹ️ Handles password encryption
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 12; // I've changed it to 12 (Raquel)

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// GET /auth/signup
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup", { layout: "/layout2" });
});

// POST /auth/signup
router.post("/signup", isLoggedOut, (req, res, next) => {
  const { username, email, password, passwordRepeat } = req.body;
  // console.log('file:', req.file);
  const signUpData = {
    username,
    email,
    password,
    passwordRepeat,
  };
  console.log("hohfos: ", req.body)

  // Check that username, email, and password are provided
  if (
    username === "" ||
    email === "" ||
    password === "" ||
    passwordRepeat === ""
  ) {
    signUpData.errorMessage =
      "All fields are mandatory. Please fill out every blank field and try again";
    signUpData.layout = "/layout2";

    res.render("auth/signup", signUpData);

    return;
  }

  if (password != passwordRepeat) {
    signUpData.errorMessage =
      "Both the password and the repeat password must be the same.";
    signUpData.layout = "/layout2";

    res.render("auth/signup", signUpData);

    return;
  }

  if (password.length < 6) {
    signUpData.errorMessage =
      "Your password needs to be at least 6 characters long.";
    signUpData.layout = "/layout2";

    res.render("auth/signup", signUpData);

    return;
  }

  //   ! This regular expression checks password for special characters and minimum length

  /*   const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    signUpData.errorMessage = "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter."
    res.render("auth/signup", signUpData, {layout: '/layouts/layout2'});
    return;
  } */

  User.findOne({ username })
  .then((user) => {
    if (user) {
      signUpData.layout = "/layout2";
      signUpData.errorMessage = "Username already exists";
      res.render("auth/signup", signUpData);
      return;
    }
  });

  // Create a new user - start by hashing the password
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      // Create a user and save it in the database
      const newUser = {username, email, password: hashedPassword}
      if (req.file) {
        // newUser.profilePic = '/uploads/' + req.file.filename
        newUser.profilePic = req.file.path
      }
      return User.create(newUser);
    })
    .then((user)=> {
      transporter.sendMail({
        from: '"Cheqq Habit Tracker " <cheqq_habit@hotmail.com>',
        to: user.email, 
        subject: 'Welcome to Cheqq', 
        html: `<h1>We are so glad you decided to join us, ${user.username}!</h1>
        <p>We hope you find Cheqq useful. Feel free to contact us with suggestions for improvement; we want our app to be the best possible habit tracker :)
        Have a good day!</p>`
      })
    })
    .then(info => console.log(info))    
    .then(() => {
      res.render("auth/login", { layout: "/layout2" });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        console.log("yes, this is the error");
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email need to be unique. Provide a valid username or email.",
          layout: "layout2",
        });
      } else {
        next(error);
      }
    });
});

// GET /auth/login
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login", { layout: "/layout2" });
});

// POST /auth/login
router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  // Check that username, email, and password are provided
  if (username === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide username, email and password.",
      layout: "/layout2",
    });

    return;
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 6) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 6 characters long.",
      layout: "/layout2",
    });
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send an error message that user provided wrong credentials
      if (!user) {
        res
          .status(400)
          .render("auth/login", {
            errorMessage: "Wrong credentials.",
            layout: "/layout2",
          });
        return;
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res
              .status(400)
              .render("auth/login", {
                errorMessage: "Wrong credentials.",
                layout: "/layout2",
              });
            return;
          }

          // Add the user object to the session object
          req.session.currentUser = user.toObject();
          // Remove the password field
          delete req.session.currentUser.password;

          res.redirect("profile");
        })
        .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
    })
    .catch((err) => next(err));
});

// GET /auth/logout
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res
        .status(500)
        .render("auth/logout", {
          errorMessage: err.message,
          layout: "/layout2",
        });
      return;
    }

    res.redirect("/");
  });
});


// Managing password retrieval

router.get("/forgot-password", isLoggedOut, (req, res, next) => {
  res.render("auth/forgot-password", { layout: "/layout2" })
})

router.post("/forgot-password", isLoggedOut, (req, res, next) => {
  const {username} = req.body
  User.find({ username })
  .then((user) => {
    let forgotPassw = {}
    if (user.length == 0) {
      forgotPassw.layout = "/layout2";
      forgotPassw.errorMessage = "The user you entered doesn't exist in the database";
      res.render("auth/forgot-password", forgotPassw);
      return;
    }
    return user
  })
  .then((user)=> {
    transporter.sendMail({
      from: '"Cheqq Habit Tracker " <cheqq_habit@hotmail.com>',
      to: user[0].email, 
      subject: 'Cheqq - Retrieve password', 
      html: `<h1>Hi there ${user[0].username},</h1>
      <p>click this link in order to create a new password, and after that you will be able to log in again. Keep up your habit tracking!</p>
      <p>Cheers,</p><p>Cheqq Team</p>
      
      <a href="https://cheqq.fly.dev/${user[0]._id}/new-password">Set new password</a>`
    }) 
  })
  .then(info => console.log(info))    
  .then(() => {
    res.render("auth/wait-for-email", { layout: "/layout2" })
  })
  .catch((error) => next(error))

})

router.get("/:userId/new-password", (req, res, next) => {
  const {userId} = req.params;
  res.render("auth/new-password", {userId, layout: "/layout2" })
})

router.post("/:userId/new-password", (req, res, next) => {
  const {userId} = req.params;
  const {password, passwordRepeat} = req.body
  const newPassw = {password, passwordRepeat}

  //Check for blank fields
  if (
    password === "" ||
    passwordRepeat === ""
  ) {
    newPassw.errorMessage =
      "Please fill out every blank field and try again.";
    newPassw.layout = "/layout2";

    res.render("auth/new-password", newPassw);
    return;
  }

  //Check if both provided passwords are equal
  if (password != passwordRepeat) {
    newPassw.errorMessage =
      "Both the password and the repeat password must be the same.";
    newPassw.layout = "/layout2";

    res.render("auth/new-password", newPassw);

    return;
  }

  if (password.length < 6) {
    newPassw.errorMessage =
      "Your password needs to be at least 6 characters long.";
    newPassw.layout = "/layout2";

    res.render("auth/new-password", newPassw);

    return;
  }

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      return User.findByIdAndUpdate(userId, {password: hashedPassword}, {new: true});
    })
    .then(info => {
      console.log("password updated!")
      res.render("auth/login", { layout: "/layout2" });
    })
    .catch((error) => next(error))


  // User.findByIdAndUpdate(userId, )
  // .then((user) => {

  // })
  // .catch(err => next(err))

})

module.exports = router;
