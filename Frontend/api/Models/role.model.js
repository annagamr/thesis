const mongoose = require("mongoose");

// Define the schema for the Role model
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

// Create the Role model based on the schema
const Role = mongoose.model("Role", roleSchema);

module.exports = Role;