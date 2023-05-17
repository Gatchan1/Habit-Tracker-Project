const { json } = require("express");
const User = require("../models/User.model");
const { DateTime } = require("luxon");


function retrieveChartData(userId) {
    User.findOne({ _id: userId })
    .populate("habits")
    .then((user) => {
        for (let i = 0; i < user.habits.length; i++) {
            console.log("datesCompleted: ", user.habits[i].datesCompleted)
            
            
            for (let j = 0; j < user.habits[i].datesCompleted.length; j++) {
                date = user.habits[i].datesCompleted[j]
                console.log(`datessss: `,DateTime.fromISO(date).ordinal)
            }


            //I think that if I use a For loop instead of a ForEach I could manage to define easily several arrays, each of them with a slight different name (maybe concatenating i?), and then in the subsequent inner loop I would push the ordinal dates... 
            // and also I have to compare the ordinals to "todays ordinal - 6", so that we only manage 7 days.
            //and also put an if so that the first 6 days OF THE YEAR behave slightly differentlyyy
                        
        }
    })
    .catch(err => console.log(err))

    let data = [`${DateTime.now().ordinal}`]
    DateTime.local(2014, 11, 31).weekday

    

    return data
}




module.exports = retrieveChartData