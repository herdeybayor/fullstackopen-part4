const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({});
  res.send(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const { title, author, url, likes } = req.body;
  const blog = new Blog({ title, author, url, likes });

  const savedBlog = await blog.save();
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
