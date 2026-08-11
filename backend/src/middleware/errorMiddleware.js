// Global Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev investigation
  console.error('❌ [API ERROR]:', {
    message: err.message,
    name: err.name,
    code: err.code,
    stack: err.stack,
    errors: err.errors ? Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {}) : undefined,
  });

  // Mongoose Bad ObjectId Cast Error (e.g. invalid ID format)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new Error(message);
    error.statusCode = 400;
  }

  // Mongoose Duplicate Key Code 11000 (e.g. unique constraint failed)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for field '${field}'. That resource already exists.`;
    error = new Error(message);
    error.statusCode = 400;
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = new Error(message);
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
