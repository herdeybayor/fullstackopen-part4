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

describe("when there is initially some blogs saved", () => {
  test("blogs are returned in json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("unique identifier property of the blog posts is named id", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const sampleBlogId = blogsAtStart[0].id;

    expect(sampleBlogId).toBeDefined();
  });
});

describe("adding a new blog", () => {
  test("creates a new blog", async () => {
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

  test("with no likes is defaulted to zero", async () => {
    const blogWithNoLikes = {
      title: "Blog Dojo",
      author: "Elon Musk",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    };

    const response = await api.post("/api/blogs").send(blogWithNoLikes);

    expect(response.body.likes).toBe(0);
  });

  test("with missing properties returns 400 Bad Request", async () => {
    const badBlog = {
      author: "Bad Author",
    };

    await api.post("/api/blogs").send(badBlog).expect(400);
  });
});

describe("viewing a specific blog", () => {
  test("succeeds with a valid id", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogsToView = blogsAtStart[0];

    const response = await api
      .get(`/api/blogs/${blogsToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toEqual(blogsToView);
  });

  test("fails with statusCode 404 if blog does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId();

    await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
  });

  test("fails with statusCode 400 id is invalid", async () => {
    const InvalidId = "23432abc";

    await api.get(`/api/blogs/${InvalidId}`).expect(400);
  });
});

describe("updating a blog", () => {
  test("succeeds with status code 200 if valid id", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const update = { likes: 5, author: "Elon Musk" };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(update)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const updatedBlog = response.body;
    expect(updatedBlog).toEqual({ ...blogToUpdate, ...update });
  });

  test("fails with a statusCode 400 Bad Request if id is invalid", async () => {
    const invalidId = "123456789";

    await api.put(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe("deleting a single blog", () => {
  test("succeeds with statusCode of 204 No Content", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[2];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
