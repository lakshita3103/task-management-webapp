const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
 title: String,
 boardId: String,
});

module.exports = mongoose.model("List", listSchema);