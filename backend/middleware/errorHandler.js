function notFoundHandler(req, res) {
  res.status(404).json({
    message: "The requested resource was not found."
  });
}

function errorHandler(error, req, res, next) {
  console.error(error);

  res.status(error.statusCode || 500).json({
    message: error.message || "Something went wrong. Please try again."
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
