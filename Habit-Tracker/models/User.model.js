const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: String,
    profilePic: {
      type: String,
      default: __dirname + "/images/default.png"
    },
    habits: [{ type: Schema.Types.ObjectId, ref: "Habit"}],
    friends: [{ type: Schema.Types.ObjectId, ref: "User"}],
    profilephotosrc: String
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  },
);

const User = model("User", userSchema);

module.exports = User;
