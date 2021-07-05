const controller = require("./controller");

// Routes
module.exports = (app) => {
  app.post("/signup", controller.signUp);                       // Signing up
  app.post("/login", controller.login);                         // Log in
  app.post("/addpost", controller.addPost);                     // Adding post
  app.post("/checkifloggedin", controller.checkIfLoggedIn);     // Checking if logged in
  app.post("/friendrequest", controller.friendRequest);         // Sending friend request
  app.post("/deletereq", controller.deleteReq)                  // Deleting friend requests
  app.post("/addfriend", controller.addFriend);                 // Accepting friend request
  app.post("/findname", controller.findName);                   // Finding a user based on his _id
  app.post("/searchusers", controller.searchUsers);             // Searching for a user based on his first name and last name
  app.post("/getpost", controller.getPosts);                    // Getting post of user and friends
  app.post("/editpost", controller.editPost);                   // Editting of post
  app.post("/deletepost", controller.deletePost);               // Deletion of post
  app.get("/findbyid", controller.findById);                    // Find user based on query
}