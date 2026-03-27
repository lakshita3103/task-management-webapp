const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
 title: String,
 userId: String
});

module.exports = mongoose.model("Board", boardSchema);