const mongoose = require("mongoose");

// schemas -> data types declaration
const userSchema = new mongoose.Schema({
 username: {
  type: String,
  require: true,
  unique: true
 },
 email: {
  type: String,
  require: true,
  unique:true
 },
 password: String,
 createdOn: String
});

module.exports = new mongoose.model("users",userSchema);