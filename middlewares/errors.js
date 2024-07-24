const errorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    error.message = err.message;

    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered.`;
      error = new errorHandler(message, 400);
    }

    // if (err.name === "CastError") {
    //   const message = `Resource not found. Invalid ${err.path}`;
    //   error = new errorHandler(message, 404);
    // }

    res.status(error.statusCode).json({
      success: false,
      message: error.message || "internal server error",
    });
  }
};
