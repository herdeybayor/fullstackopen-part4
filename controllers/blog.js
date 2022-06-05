const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  res.send(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const { title, author, url, likes } = req.body;

  // getToken
  const token = getTokenFrom(req);

  const decodedToken = jwt.verify(token, process.env.AUTH_SECRET);

  if (!decodedToken.id) {
    return res.status(401).json({ error: "token missing or invalid" });
  }

  // get user
  const user = await User.findById(decodedToken.id);

  if (!user) return res.status(200).json({ error: "userId is required" });

  // creating a new blog
  const blog = new Blog({ title, author, url, likes, user: user._id });

  // saving new blog
  const savedBlog = await blog.save();

  // updating user blogs
  user.blogs = [...user.blogs, savedBlog._id];

  // saving user
  await user.save();

  res.status(201).json(savedBlog);
});

blogsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);

  if (blog) {
    res.status(200).json(blog);
  } else {
    res.status(404).end();
  }
});

blogsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Blog.findByIdAndDelete(id);
  res.status(204).end();
});

blogsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, likes, author, url } = req.body;

  const oldBlog = await Blog.findById(id);

  const newBlog = {
    title: title || oldBlog.title,
    author: author || oldBlog.author,
    url: url || oldBlog.url,
    likes: likes || oldBlog.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(id, newBlog, {
    new: true,
    runValidators: true,
    context: "query",
  });

  res.json(updatedBlog);
});

module.exports = blogsRouter;
