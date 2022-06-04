const logger = require("./logger");

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  logger.error(error);

  if (error.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "ReferenceError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "MongoServerError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = { unknownEndpoint, errorHandler };
