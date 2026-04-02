const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");

const connectDatabase = require("./config/database");
const boardRoutes = require("./routes/boardRoutes");
const listRoutes = require("./routes/listRoutes");
const taskRoutes = require("./routes/taskRoutes");
const homeRoutes = require("./routes/homeRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");
const { flashMiddleware } = require("./middleware/flashMiddleware");

const app = express();

connectDatabase();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "taskflow-secret",
    resave: false,
    saveUninitialized: false
  })
);
app.use(flashMiddleware);

app.locals.formatDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(value);

app.use("/", homeRoutes);
app.use("/boards", boardRoutes);
app.use("/boards/:boardId/lists", listRoutes);
app.use("/lists/:listId/tasks", taskRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
