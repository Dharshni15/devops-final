const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔗 Connect to MongoDB (Docker container name = mongo)
mongoose.connect('mongodb://mongo:27017/todo_db')
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.log("MongoDB connection error:", err));

// 🧱 Schema
const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

// 📦 Model
const Task = mongoose.model('Task', TaskSchema);

// ➕ Add Task
app.get('/add', async (req, res) => {
  try {
    const taskName = req.query.task;

    if (!taskName) {
      return res.status(400).send("Task is required ❌");
    }

    const newTask = new Task({ name: taskName });
    await newTask.save();

    res.send("Task saved in MongoDB ✅");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error saving task ❌");
  }
});

// 📋 Get All Tasks
app.get('/list', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching tasks ❌");
  }
});

// ❌ Delete Task
app.get('/delete', async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(400).send("Task ID required ❌");
    }

    await Task.findByIdAndDelete(id);

    res.send("Task deleted successfully 🗑️");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error deleting task ❌");
  }
});

// 🏠 Root route (optional test)
app.get('/', (req, res) => {
  res.send("Backend is running 🚀");
});

// 🚀 Start Server
app.listen(3000, () => {
  console.log("Backend running on port 3000 🚀");
});