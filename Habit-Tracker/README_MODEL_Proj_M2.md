# Project_name

The project is a habit tracker that also has functions of a social network. Users can create an account, create/choose a selection of habits that they want to create on a daily basis and check off completed habits each day.

## About us

We are a team of three students fully invested in a Web Development bootcamp in Barcelona. Our names are Camila Buldin, Lisa Schwetlick and Raquel Barrio.

![Project Image](https://assets.website-files.com/5c755d7d6fa90e6b6027e74c/642fe45b20446d4f867135fb_%D0%A1over.jpg "Project Image")

## Deployment

You can check the app fully deployed [here](https://be.green/es/blog/guia-de-cuidado-de-los-cactus/).

## Work structure

We developed this project using [Trello](https://trello.com/home) to organize our workflow.

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

profilePhoto: { type: String, default: default.png },

habits: {[ type: schema.Types.ObjectID, ref: "Habit" ]}

friends: Array,

});

### Habit model<br>

const habitSchema = new Schema({

title: { type: String, required: true },

user: { type: schema.Types.ObjectID, ref: "User" },

datescompleted: {[Date]},

groupOfUsers: {[ type: schema.Types.ObjectID, ref: "User" ]}

private: boolean
});

## Routes

## Routes

| Metodo | endPoint           |                Requiere                     |                  Accion                   |
| :----: | :----------------: | :-----------------------------------------: | :---------------------------------------: |
|  GET   |     /              |                                             |               Carga el home               |
|  GET   |  /singup           |                                             |             Carga el Sign Up              |
|  POST  |  /singup           | const {username, password, email} = req.body| Register the user and redirects to /login |
|  GET   |  /login            |                                             |              Carga el Log in              |
|  POST  |  /login            |    const {username, password} = req.body    |   Logs a user in and redirects to home    |
|  GET   | /:username/profile |         const {username} = req.params       |          Shows the users profile          |
|  GET   | /:username/profile/edit |   const {username} = req.params        |         Shows form to change profile      |
|  POST  | /:username/profile |       const {username} = req.params         | Updates profile and redirects to profile  |
|  GET   | /habit/create      |                                             |        Shows form to create a habit       |
|  POST  | /habit/create      |                                             |  Creates habit and redirects to profile   |
|  GET   | /:id/groupHabit    |             const {id} = req.params         |       Shows group habits                  |
|  GET   | /search            |                                             |  shows form to search for other users     |

## API

This project consumes this [API](https://api.chucknorris.io/) to make some random phrases appear in the home page.

---
