const logger = require("./logger");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userExtractor = async (req, res, next) => {
  // code that extracts the token
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    const token = authorization.substring(7);

    // Verify token
    const decodedToken = jwt.verify(token, process.env.AUTH_SECRET);

    if (!decodedToken.id) {
      return res.status(401).json({ error: "token missing or invalid" });
    }
    req.user = await User.findById(decodedToken.id);
    next();
  } else {
    res.status(401).json({ error: "jwt must be provided" });
  }
};

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
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: error.message });
  } else if (error.name === "TokenExpiredError") {
    return res.status(401).json({ error: "token expired" });
  }

  next(error);
};

module.exports = { unknownEndpoint, errorHandler, userExtractor };
