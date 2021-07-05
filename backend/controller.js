const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// get user model registered in Mongoose
const User = mongoose.model("User");
const Post = mongoose.model("Post");

// Sign up
exports.signUp = (req, res) => {
  // New user
  const newuser = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    friendreq: [],
    friend: []
  });
  // Checks if the password is same as the repeat password
  if (req.body.repassword !== newuser.password){
    res.send({ success: "no match"})
  } else {
      // Checks if it contains at least 1 upper, 1 lower and 1 number
      var number = false;
      var upper = false;
      var lower = false;
      // Loop that checks
      for (let x = 0; x < newuser.password.length; x++){
        if(parseInt(newuser.password[x])){
            //checks if the current character is an int
            number = true;      //has at least 1 number
        } else if(newuser.password[x] === newuser.password[x].toUpperCase()){
            //checks if the current character is uppercase
            upper = true;       //has at least 1 uppercase character
        } else if(newuser.password[x] === newuser.password[x].toLowerCase()){
            //checks if the current character is lowercase
            lower = true;       //has at least 1 lowercase character
        }
    }
    if (!(number && upper && lower)) {
      // If one condition not satisfied then send "at least" to prompt
      res.send({success: "at least"})
    } else if (newuser.password.length < 8){
      // If length is less than 8 then send "length" to prompt
      res.send({success: "length"})
    } else {
      // Checks if the email is already in the database
      User.find({email: req.body.email}, (err,user) => {
        if(user.length!==0){
          // If email already used then send "taken" to prompt
          res.send({success: "taken"})
        } else {
          // Saves new user
          newuser.save((err) => {
            if (err) { return res.send({ success: false }); }
            else { return res.send({ success: true }); }
          });
        }
      })
    }
  }

}
// Log in
exports.login = (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password;

  User.findOne({ email }, (err, user) => {
    // check if email exists
    if (err || !user) {
      //  Scenario 1: FAIL - User doesn't exist
      console.log("user doesn't exist");
      return res.send({ success: "no exist" });
    }

    // check if password is correct
    user.comparePassword(password, (err, isMatch) => {
      if (err || !isMatch) {
        // Scenario 2: FAIL - Wrong password
        console.log("wrong password");
        return res.send({ success: "wrong" });
      }

      console.log("Successfully logged in");

      // Scenario 3: SUCCESS - time to create a token
      const tokenPayload = {
        _id: user._id
      }

      const token = jwt.sign(tokenPayload, "THIS_IS_A_SECRET_STRING");

      // return the token to the client
      return res.send({ success: true, token, id: user._id });
    })
  })
}
// Check if logged in
exports.checkIfLoggedIn = (req, res) => {

  if (!req.cookies || !req.cookies.authToken) {
    // Scenario 1: FAIL - No cookies / no authToken cookie sent
    return res.send({ isLoggedIn: false });
  }

  // Token is present. Validate it
  return jwt.verify(
    req.cookies.authToken,
    "THIS_IS_A_SECRET_STRING",
    (err, tokenPayload) => {
      if (err) {
        // Scenario 2: FAIL - Error validating token
        return res.send({ isLoggedIn: false });
      }

      const userId = tokenPayload._id;

      // check if user exists
      return User.findById(userId, (userErr, user) => {
        if (userErr || !user) {
          // Scenario 3: FAIL - Failed to find user based on id inside token payload
          return res.send({ isLoggedIn: false });
        }

        // Scenario 4: SUCCESS - token and user id are valid
        return res.send({ isLoggedIn: true });
      });
    });
}
// Finds user based on id
exports.findName = (req,res) => {
  User.findOne({ _id: req.body.id} , (err, user) => {
    // Sends user
    if (!err) { res.send(user) }
  })
}
// Finds user based on first name and last name
exports.searchUsers = (req,res) => {
  // Condition is not case sensitive
  User.find({$or: [{firstname: new RegExp(req.body.name, "i")}, {lastname: new RegExp(req.body.name, "i")}],
    _id: {$ne: req.body.id}}, (err,user) => {
      // Sends user
    if (!err) { res.send(user);}
  })
}
// Finds user by query
exports.findById = (req, res) => {
  if (!req.query.id) { return res.send(null) }

  User.findOne({ _id: req.query.id}, (err, user) => {
    // Sends user
    if (!err) { res.send(user) }
  })
}
// Sends friend request
exports.friendRequest = (req, res) => {
  // Pushed id of user to friend request array
  User.updateOne({ _id: req.query.id},{ $push: {friendreq: req.body.id}}, (err,user) => {
    if (err) {res.send(false)}
    else {res.send(true)}
  })
}
// Deletes friend request
exports.deleteReq = (req, res) => {
  // Pulls friend request
  User.updateOne({ _id: req.body.userid},{ $pull: {friendreq: req.body.id}}, (err,user) => {
    if (err) {res.send(false)}
    else {res.send(true)}
  })
}
// Add/Accept friend request
exports.addFriend = (req, res) => {
  // Push to the user's friend list
  User.updateOne({ _id: req.body.userid},{ $push: {friends: req.body.id}}, (err,user) => {
    if (err) {res.send(false)}
    else {
      // Push to the user's new friend's friend list
      User.updateOne({ _id: req.body.id},{ $push: {friends: req.body.userid}}, (err,user) => {
        if (err) {res.send(false)}
        else{
          res.send(true)
        }
      })
    }
  })
}
// Creates new post
exports.addPost = (req, res) => {
  // New post
  const newpost = new Post({
    author: req.body.post.author,
    name: req.body.post.name,
    timestamp: req.body.post.timestamp,
    content: req.body.post.content
  });
  // Saves new post
  newpost.save((err) => {
    if (err) { return res.send({ success: false }); }
    else { return res.send({ success: true }); }
  });
}
// Edits existing post
exports.editPost = (req, res) => {
  // Edits post by searching for its post id and then modified its content and timestamp
  Post.updateOne({_id: req.body.post._id}, {$set: {content: req.body.content, timestamp: req.body.timestamp}}, (err,user) => {
    if(err){res.send(false)}
    else {res.send(true)}
  })
}
// Deletes existing post
exports.deletePost = (req, res) => {
  // Deletes post based on post id
  Post.deleteOne({_id:req.body.post._id}, (err,user) => {
    if(err){res.send(false)}
    else{res.send(true)}
  })
}
// Gets post from user and friends
exports.getPosts = (req,res) => {
  // Finds all the post of the user and friends
  Post.find({$or: [
    {author: {$in:req.body.friends}},
    {author: req.body.id}
    ]}, (err, post) => {
    if (!err) { res.send(post) }
  }).sort({timestamp: -1})
  // Sorts based on timestamp
}