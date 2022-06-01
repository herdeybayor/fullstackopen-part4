const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");

const api = supertest(app);

const Blog = require("../models/blog");
const helper = require("./test_helper");
beforeEach(() => {
  Blog.deleteMany({});
  Blog.insertMany(helper.initialBlogs);
});

test("blogs are returned in json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 100000);

test("unique identifier property of the blog posts is named id", async () => {
  const blogAtStart = await helper.blogsInDb();
  const sampleBlogId = blogAtStart[0].id;
  console.log(blogAtStart[0]);

  expect(sampleBlogId).toBeDefined();
});

afterAll(() => {
  mongoose.connection.close();
});
