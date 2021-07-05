// LAR, JEFF EMERSON F.
// 2019-03845
// EXERCISE 10
// 06/09/2021

// This website has core pages signup, login, feed, profile and search with backend and fronend support

// THIS IS THE BACKEND SERVER

const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// connect to Mongo DB
mongoose.connect(
  "mongodb://localhost:27017/EXER10",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) { console.log(err); }
    else { console.log("Successfully connected to Mongo DB"); }
  });

// register User model with Mongoose
require("./models/user");
require("./models/post");

// initialize the server
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// allow CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers,Access-Control-Allow-Methods,Origin,Accept,Content-Type");
  res.setHeader("Access-Control-Allow-Credentials","true");
  next();
});

// declare routes
require("./routes")(app);

// start server
app.listen(3001, (err) => {
  if (err) { console.log(err); }
  else { console.log("Server listening at port 3001"); }
});