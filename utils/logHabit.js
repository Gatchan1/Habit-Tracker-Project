const User = require("../models/User.model");

function logHabit(user) {
  let j;
  let checkedHabits = [];
  for (let i = 0; i < user.habits.length; i++) {
    j = user.habits[i].datesCompleted.length;
    let lastDate = user.habits[i].datesCompleted[j - 1];
    if (lastDate == DateTime.now().toISODate()) {
      user.habits[i].checked = "yes";
    }
  }
};

module.exports = logHabit;
