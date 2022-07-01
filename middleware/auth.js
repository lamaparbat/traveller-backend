// importing packages
const jwt = require("jsonwebtoken");

// form validation [helper function]
const signupFormValidation = (req, res, next) => {
 // check 3 fields
 if (Object.keys(req.body).length < 3)
  return res.status(200).send("Some fields are missing");

 // destructuring incoming form data
 const { username, email, password } = req.body;

 // null check
 if (username === null || undefined && email === null || undefined && password === null || undefined)
  return res.status(404).send("Some fields seems null. Please fill the value");

 // empty value check
 if (username.length < 1 && email.length < 1 && password.length < 1)
  return res.status(404).send("Please fill some value on the input field !!");

 // email formatting
 if (!email.includes("@gmail.com"))
  return res.status(404).send("Email format is unknown. Please kindly enter correct email format like abc@gmail.com");

 // if everything above condition pass, then proceed to next
 next();
}
const loginFormValidation = (req, res, next) => {
 // check 3 fields
 if (Object.keys(req.body).length < 2)
  return res.status(200).send("Some fields are missing");

 // destructuring incoming form data
 const { email, password } = req.body;

 // null check
 if (email === null || undefined && password === null || undefined)
  return res.status(404).send("Some fields seems null. Please fill the value");

 // empty value check
 if (email.length < 1 && password.length < 1)
  return res.status(404).send("Please fill some value on the input field !!");

 // email formatting
 if (!email.includes("@gmail.com"))
  return res.status(404).send("Email format is unknown. Please kindly enter correct email format like abc@gmail.com");

 // if everything above condition pass, then proceed to next
 next();
}


// jwt tokenization
const generateToken = async (email, password, access_token_key, refresh_token_key) => {
 const access_token = await jwt.sign({ email: email, password: password }, access_token_key, {expiresIn:"7d"});
 const refresh_token = await jwt.sign({ email: email, password: password }, refresh_token_key);
 return { access_token, refresh_token }
}

// verify token [helper function]
const verifyToken = async (req, res, next) => {
 //token validation
 if (req.header('authorization') === undefined || req.header('authorization').length <= 9) {
  return res.status(404).send({
   message: "Token is empty !!"
  });
 } 
 
 var access_token = req.header('authorization')
 
 //remove the bearer text from token
 access_token = access_token.substr(7, access_token.length);

 try {
  const result = await jwt.verify(access_token, process.env.access_token_key);
  next()
 } catch (error) {
  return res.status(404).send({
   message: "Session timeout."
  });
 }
}


// pin data validaton
const pindataValidation = (data) => {
 // check 3 fields
 if (Object.keys(data).length < 5)
  return { passed: false, message: "Some fields are missing !!" };
 
 // destructuring 'data'
 const { username, title, desc, lat, lon } = data;
 
 // null check
 if (username === null || undefined && title === null || undefined && desc === null || undefined && lat === null || undefined && lon === null || undefined)
  return { passed: false, message: "Some fields value seems null. Please fill the value" }

 // empty value check
 if (username.length < 1 && title.length < 1 && desc.length < 1 && lat < 1 && lon < 1)
  return { passed: false, message: "Please fill some value on the input field !!" }
 
 return { passed: true, message: "Validation passed" };
}
 

module.exports = { signupFormValidation, loginFormValidation, generateToken, verifyToken, pindataValidation }