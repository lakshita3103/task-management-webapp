const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const apiBoardRoutes = require("./routes/api/boardRoutes");
const apiListRoutes = require("./routes/api/listRoutes");
const apiTaskRoutes = require("./routes/api/taskRoutes");
const { protect } = require("./middleware/authMiddleware");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();
const frontendDistPath = path.join(__dirname, "..", "frontend", "dist");

app.use(
  cors({
    origin: process.env.CLIENT_URL || true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/boards", protect, apiBoardRoutes);
app.use("/api/boards/:boardId/lists", protect, apiListRoutes);
app.use("/api/lists/:listId/tasks", protect, apiTaskRoutes);

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
