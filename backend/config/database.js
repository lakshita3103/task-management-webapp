const mongoose = require("mongoose");

let isConnected = false;

async function connectDatabase() {
  if (isConnected) {
    return mongoose.connection;
  }

  const mongoUri = (process.env.MONGODB_URI || "").trim();

  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI is not set. Add your MongoDB Atlas connection string to backend/.env."
    );
  }

  if (
    mongoUri.includes("<username>") ||
    mongoUri.includes("<password>") ||
    mongoUri.includes("<cluster-name>")
  ) {
    throw new Error(
      "MONGODB_URI still contains placeholder values. Replace them with your real MongoDB Atlas username, password, and cluster name."
    );
  }

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      family: 4
    });

    isConnected = true;
    console.log("MongoDB Atlas connected");

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error.message);
    });

    mongoose.connection.on("disconnected", () => {
      isConnected = false;
      console.warn("MongoDB disconnected. Check Atlas availability and network access.");
    });

    return mongoose.connection;
  } catch (error) {
    const guidance = [
      "MongoDB Atlas connection failed.",
      `Reason: ${error.message}`
    ];

    if (error.name === "MongoServerSelectionError") {
      guidance.push(
        "Verify the Atlas URI, confirm the database user credentials, and whitelist your IP in Atlas Network Access."
      );
    }

    if (error.message.includes("URI") || error.message.includes("connection string")) {
      guidance.push(
        "If your Atlas password contains special characters, URL-encode it before placing it in MONGODB_URI."
      );
    }

    console.error(guidance.join(" "));
    throw error;
  }
}

module.exports = connectDatabase;
