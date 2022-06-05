require("dotenv").config();

const MONGO_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGO_URI
    : process.env.MONGO_URI;
const PORT = process.env.PORT;
const AUTH_SECRET = process.env.AUTH_SECRET;

module.exports = { MONGO_URI, PORT, AUTH_SECRET };
