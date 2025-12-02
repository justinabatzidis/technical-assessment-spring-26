import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import 'dotenv/config';
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
const PollSchema = new mongoose.Schema({
  questionId: String,
  question: String,
  options: [{
    text: String,
    voters: [String]
  }]
});
const Poll = mongoose.model("Poll", PollSchema);
const CommentSchema = new mongoose.Schema({
  page: String,
  name: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});
const Comment = mongoose.model("Comment", CommentSchema);
app.get("/", (req, res) => {
  res.send("Backend is running! 🚀");
});
app.get("/api/poll/:questionId", async (req, res) => {
  try {
    let poll = await Poll.findOne({ questionId: req.params.questionId });
    if (!poll) {
      poll = await Poll.create({
        questionId: req.params.questionId,
        question: "Poll Question",
        options: [
          { text: "greedy", voters: [] },
          { text: "you broke me first", voters: [] },
          { text: "exes", voters: [] },
          { text: "It's ok I'm ok", voters: [] },
          { text: "TIT FOR TAT", voters: [] }
        ]
      });
    }
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/poll/vote", async (req, res) => {
  try {
    const { questionId, option, userName } = req.body;
    const poll = await Poll.findOne({ questionId });
    
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }
    poll.options.forEach(opt => {
      opt.voters = opt.voters.filter(v => v !== userName);
    });
    const selectedOption = poll.options.find(opt => opt.text === option);
    if (selectedOption) {
      selectedOption.voters.push(userName);
    }
    await poll.save();
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/comments/:page", async (req, res) => {
  try {
    const comments = await Comment.find({ page: req.params.page }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/comments", async (req, res) => {
  try {
    const comment = await Comment.create(req.body);
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});