const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
 title: String,
 description: String,
 listId: String,
});

module.exports = mongoose.model("Task", taskSchema);