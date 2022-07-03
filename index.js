//  *************** ->  importing modules  <- ****************
require("dotenv").config()
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");


// *************** ->  importing user-defined modules   <- ****************
require("./db/connection")(process.env.DB_URL);
const userModel = require("./db/models/userModel");
const pinModel = require("./db/models/pinModel");
const auth = require("./middleware/auth");


// *************** ->  server config   <- ****************
const server = express();
const PORT = process.env.PORT || 8000;


// *************** ->  middlewares  <- ****************
server.use(cors());
server.use(express.json())
server.use(cookieParser())


// *************** ->   routes  <- ****************
server.get("/", (req, res) => {
 res.status(200).send("Server has started..");
});

server.post("/traveller/signup", auth.signupFormValidation, async (req, res) => {
 // destructuring data from `req` object
 const { username, email, password } = req.body;
 
 // encrypting the password
 const hash_password = await bcrypt.hash(password, parseInt(process.env.bcrypt_salt_round))
 
 // // Database operations
 const build = new userModel({ username: username, email: email, password: hash_password });
 try {
  const result = await build.save();
  res.status(200).send("created successfully");
 } catch (error) {
  if (error.keyValue.email !== undefined)
   return res.status(404).json("Email is already taken !!");
  if (error.keyValue.username != undefined)
   return res.status(404).json("Username is already taken !!");
  return res.status(404).json("INTERNAL SERVER ERROR !!");
 }
});

server.post("/traveller/login", auth.loginFormValidation, async (req, res) => {
 // destructuring data from `req` object
 const { email, password } = req.body;
 
 // Database operation
 try {
  const result = await userModel.findOne({ email: email });
  
  // decrypting password
  const ispasswordValid = await bcrypt.compare(password, result.password)
  
  !ispasswordValid && res.status(404).send("Invalid password !!");
  
  if (result.length === 0)
   return res.status(404).send({
    message: "Please enter correct email or password",
    data: [],
    token: {}
   });

  return res.status(200).send({
   message: "Login successfull!",
   data: { name: result.username, email: result.email },
   token: await auth.generateToken(email, password, process.env.access_token_key, process.env.refresh_token_key)
  });
 } catch (error) {
  res.status(500).send("INRERNAL SERVER ERROR !!");
 }
});

server.post("/traveller/pins", auth.verifyToken, async (req, res) => {
 const validationResult = auth.pindataValidation(req.body)
 if (!validationResult.passed)
  return res.status(404).send(validationResult.message);

 const { username, title, desc, lat, lon } = req.body;

 // Database operation
 const createdOn = new Date().toLocaleDateString();
 const pinData = new pinModel({ username, title, desc, lat, lon, createdOn });
 
 try {
  const result = await pinData.save();
  res.status(200).send("Location pinned successfully.");
 } catch (error) {
  res.status(200).send("INTERNAL SERVER ERROR !!");
 }
});

server.get("/traveller/getPinnedData", auth.verifyToken, async (req, res) => {
 try {
  // fetch the pinned data
  const pinnedData = await pinModel.find();
  
  //validate the pinned response result
  if (pinnedData === null || undefined)
    return res.status(200).send("0 Pinned found !!");

  res.status(200).send(pinnedData)
   
 } catch (error) {
   res.status(500).send("INTERNAL SERVER ERORR !")
 }
 
 
})

server.post("/traveller/logout", auth.clearToken, (req, res) => {
 res.status(200).send("Logout successfully !");
})


//  *************** ->  port listener  <- ****************
server.listen(PORT, () => {
 console.log(`Listening to the port ${PORT}`);
});
