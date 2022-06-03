const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");

const api = supertest(app);

const Blog = require("../models/blog");
const helper = require("./test_helper");
beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test("blogs are returned in json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 100000);

test("unique identifier property of the blog posts is named id", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const sampleBlogId = blogsAtStart[0].id;

  expect(sampleBlogId).toBeDefined();
});

test("a new blog post is created", async () => {
  const newBlog = {
    title: "Typescript",
    author: "Sherifdeen Adebayo",
    url: "https://sherifdeenadebayo.com",
    likes: 2,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  const titles = blogsAtEnd.map((blog) => blog.title);
  expect(titles).toContain("Typescript");
});

test("a blog with no likes is defaulted to zero", async () => {
  const blogWithNoLikes = {
    title: "Blog Dojo",
    author: "Elon Musk",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
  };

  const response = await api.post("/api/blogs").send(blogWithNoLikes);

  expect(response.body.likes).toBe(0);
});

afterAll(() => {
  mongoose.connection.close();
});
