function notFoundHandler(req, res) {
  res.status(404).render("error", {
    title: "Page Not Found",
    message: "The page you requested does not exist.",
    statusCode: 404
  });
}

function errorHandler(error, req, res, next) {
  console.error(error);

  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong. Please try again.";

  res.status(statusCode).render("error", {
    title: "Something Went Wrong",
    message,
    statusCode
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
