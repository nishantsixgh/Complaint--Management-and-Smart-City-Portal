export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, _req, res, _next) => {
  let error = {
    message: err.message,
    statusCode: res.statusCode === 200 ? 500 : res.statusCode
  };

  if (err.name === "CastError") {
    error = {
      message: "Resource not found",
      statusCode: 404
    };
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    error = {
      message: `${field} already exists`,
      statusCode: 400
    };
  }

  if (err.name === "ValidationError") {
    error = {
      message: Object.values(err.errors)
        .map((validationError) => validationError.message)
        .join(", "),
      statusCode: 400
    };
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  const response = {
    success: false,
    message: error.message || "Server error",
    error: {
      statusCode: error.statusCode || statusCode
    }
  };

  if (process.env.NODE_ENV !== "production") {
    response.error.stack = err.stack;
  }

  res.status(error.statusCode || statusCode).json(response);
};
