const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const exerciseSchema = require('./exerciseSchema')

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  exercises: [exerciseSchema]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
