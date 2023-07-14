# Project_name

The project is a habit tracker app that also has functions of a social network. Users can create an account, create/choose a selection of habits that they want to participate in and check off completed habits each day. The app is called Cheqq.

There are graphs showing your progress, both in the current week and across the last seven natural days.

## About us

We are a team of three students fully invested in a Web Development bootcamp in Barcelona. Our names are Camila Buldin, Lisa Schwetlick and Raquel Barrio.

![Project Image](https://res.cloudinary.com/dqzjo5wsl/image/upload/v1689328762/cheqq_valjxz.png "Project Image")

## Deployment

You can check the app fully deployed [here](https://cheqq.fly.dev/).

## Work structure

We used Discord to send us any interesting links and keep each other posted about any news, but mainly we organised everything face to face.

## Installation guide

- Fork this repo
- Clone this repo

```shell
$ cd folder-project
$ npm install
$ npm start
```

## Models

### User model<br>

const userSchema = new Schema({

username: {
type: String,
required: true,
unique: true
},

email: {
type: String,
required: true,
trim: true,
lowercase: true
},

password: {
type: String,
required: true
},

bio: { type: String, default: ''}

profilePic: { type: String, default: default.png },

habits: {[ type: schema.Types.ObjectID, ref: "Habit" ]}

friends: Array,

});

### Habit model<br>

const habitSchema = new Schema({

title: { type: String, required: true },

user: { type: schema.Types.ObjectID, ref: "User" },

datescompleted: [{ type: String }],

groupOfUsers: {[ type: schema.Types.ObjectID, ref: "User" ]}

private: boolean
});

## Routes

| Metodo | endPoint           |                Requiere                     |                  Accion                   |
| :----: | :----------------: | :-----------------------------------------: | :---------------------------------------: |
|  GET   |     /              |                                             |               Loads homepage              |
|  GET   |  /signup           |                                             |               Loads Sign Up               |
|  POST  |  /signup           | const {username, password, passwordRepeat, email} = req.body  |   Register user and redirects to /login   |
|  GET   |  /login            |                                             |                Loads Login                |
|  POST  |  /login            |    const {username, password} = req.body    |  Logs a user in and redirects to profile  |
|  GET   |      /logout       |                                             | Elliminates req.session & redirects to "/"|
|  GET   |  /forgot-password  |                                             |  Loads form page for requesting password  |
|  POST  |  /forgot-password  |         const {username} = req.body         |    Sends email for password retrieval     |
|  GET   |/:userId/new-password|                                            | Loads form page for entering new password |
|  POST  |/:userId/new-password|      const {userId} = req.params; const {password, passwordRepeat} = req.body          |  Updates password and redirects to login  |
|  GET   |      /profile      |           req.session.currentUser           |    Shows the user profile (with graph)    |
|  GET   |    /getChartData   |     prepares user habits data for graph     |                                           |
|  GET   |    /profile/edit   |            req.session.currentUser          |         Shows form to change profile      |
|  POST  |    /profile/edit   |  const {username, email, bio, profilePic} = req.params | Updates profile and redirects to profile  |
|  GET   |   /habit/create    |                                             |        Shows form to create a habit       |
|  POST  |   /habit/create    |   const { title, description } = req.body   |  Creates habit and redirects to profile   |
|  GET   |/showhabit/:habitId |          let { habitId } = req.params       | Displays links for edit and delete routes |
|  GET   |   /:habitId/edit   |          let { habitId } = req.params       |         Displays edit habit form          |
|  POST  |   /:habitId/edit   | const { title, description } = req.body; let { habitId } = req.params|   Updates habit and redirects to profile  |
|  POST  |  /delete/:habitId  |        let { habitId } = req.params         |               Deletes habit               |
|  POST  |      /search       |                                             |  redirects to found user's public profile |
|  GET   |     /:username     |        let { username } = req.params        |      shows a user's public profile        |
|  POST  |/:userId/join/:habitId|   let { habitId, userId } = req.params    |creates new habit copy and updates the other|
|  GET   |/grouphabit/:habitId|         let { habitId } = req.params        |          Shows group shared habit         |
|  POST  |  /habits/:habitId  |       let habitId = req.params.habitId      |Updates habit as completed for current date|

## API

This project mimics an API through an internal route so that we can fetch the json data through axios and display it through a chart.js graph.

## Nodemailer

We use nodemailer for sending an email welcoming each user after signup, and also safe password retrieval is thoroughly implemented thanks to email sending.

---
