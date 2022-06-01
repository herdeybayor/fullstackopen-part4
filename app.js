const express = require("express");
const app = express();
require("express-async-errors");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const { info } = require("./utils/logger");
const config = require("./utils/config");
const Blog = require("./models/blog");
const blogRouter = require("./controllers/blog");
const middleware = require("./utils/middleware");

mongoose
  .connect(config.MONGO_URI)
  .then(() => info("Connection to database successful!"))
  .catch((error) => error(error));

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/blogs", blogRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
