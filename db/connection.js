const mongoose = require("mongoose");
const { ServerApiVersion } = require("mongodb");

const DB_CONNECT = (DB_URL) => {
 mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
 })
  .then(() => console.log("Database connection successfull !!"))
  .catch((err) => console.log("Database connection interrupted !!"))
}

module.exports = DB_CONNECT;



