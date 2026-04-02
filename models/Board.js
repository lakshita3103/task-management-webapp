const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60
    },
    description: {
      type: String,
      trim: true,
      maxlength: 180,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Board", boardSchema);
