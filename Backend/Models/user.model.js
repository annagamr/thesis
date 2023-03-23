//Importing mongoose library
const mongoose = require("mongoose");

//schema that describes user model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ]
});

//Creating new User model using mongoose.model() method. Taking name of the model(user) and a schema describing structure of docs in collection
const User = mongoose.model("User", userSchema);

module.exports = User;