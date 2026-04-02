const mongoose = require("mongoose");

let isConnected = false;

async function connectDatabase() {
  if (isConnected) {
    return;
  }

  const mongoUri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/taskflow_ejs";

  try {
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = connectDatabase;
