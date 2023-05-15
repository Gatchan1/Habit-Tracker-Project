const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case

    const habitSchema = new Schema({

        title: { type: String, required: true },
        
        user: { type: Schema.Types.ObjectID, ref: "User" },
        
        datesCompleted: [Date],
        
        groupOfUsers: [{ type: Schema.Types.ObjectID, ref: "User" }],
        
        private: Boolean
        });

const Habit = model("Habit", habitSchema);

module.exports = Habit;
