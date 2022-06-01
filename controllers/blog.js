const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({});
  res.send(blogs);
});

blogRouter.post("/", async (req, res) => {
  const { title, author, url, likes } = req.body;
  const blog = new Blog({ title, author, url, likes });

  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
});

module.exports = blogRouter;
