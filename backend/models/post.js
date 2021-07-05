const mongoose = require("mongoose");

// Post model schema
const PostSchema = new mongoose.Schema({
  author: { type: mongoose.ObjectId, required: true },
  name: { type: String, required: true },
  timestamp: { type: Date, required: true },
  content: { type: String, required: true }
});

module.exports = mongoose.model("Post", PostSchema);