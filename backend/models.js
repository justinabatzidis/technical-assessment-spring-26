import mongoose from "mongoose";

// Comment Schema
const CommentSchema = new mongoose.Schema({
  page: String,
  name: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

// Poll Schema
const PollSchema = new mongoose.Schema({
  questionId: String,
  question: String,
  options: [{
    text: String,
    voters: [String]
  }]
});

export const Comment = mongoose.model("Comment", CommentSchema);
export const Poll = mongoose.model("Poll", PollSchema);