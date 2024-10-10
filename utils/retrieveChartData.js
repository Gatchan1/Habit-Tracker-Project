
//this is not being used


const { json } = require("express");
const User = require("../models/User.model");
const { DateTime } = require("luxon");


function retrieveChartData(userId) {    
    let chartData = []
    User.findOne({ _id: userId })
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
         console.log("tio joder:", chartData)
         return chartData

    })
    .catch(err => console.log(err))

    // let data = [`${DateTime.now().ordinal}`]
    // DateTime.local(2014, 11, 31).weekday
    // console.log("dentro de la funcion:",chartData)
    
    
    // return data
}




module.exports = retrieveChartData