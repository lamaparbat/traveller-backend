const mongoose = require("mongoose");

const pinSchema = new mongoose.Schema({
 username: String,
 title: String,
 desc: String,
 lat: Number,
 lon: Number,
 createdOn: String
});

module.exports = new mongoose.model("pin", pinSchema);
