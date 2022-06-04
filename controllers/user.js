const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

usersRouter.get("/", async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;

  // Validate user input
  if (!(username && password)) {
    return res.status(400).json({ error: "All input is required" });
  }

  // Validating user password
  if (password.length < 3) {
    return res
      .status(400)
      .json({ error: "Password must be at least 3 characters long" });
  }

  // Check if user already exists
  const oldUser = await User.findOne({ username });
  if (oldUser) {
    return res.status(400).json({ error: "User Already Exist. Please Login" });
  }

  // Hashing password
  const saltRound = 10;
  const passwordHash = await bcrypt.hash(password, saltRound);

  // Creating user
  const user = new User({
    username,
    name,
    password: passwordHash,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

module.exports = usersRouter;
