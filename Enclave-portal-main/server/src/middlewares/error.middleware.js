import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack || err.message);

  // Multer specific errors (file too large, unexpected field, etc.)
  if (err.name === "MulterError") {
    const messages = {
      LIMIT_FILE_SIZE: "Image must be smaller than 5MB.",
      LIMIT_UNEXPECTED_FILE: "Unexpected file field.",
    };

    return res.status(400).json({
      success: false,
      message: messages[err.code] || err.message,
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
};

export default errorHandler;