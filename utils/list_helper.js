const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, current) => {
    return sum + current.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  const likes = blogs.map((blog) => blog.likes);
  const highestLike = Math.max(...likes);
  return blogs.find((blog) => blog.likes === highestLike);
};

const mostBlogs = (blogs) => {
  let authors = [];
  for (const blog of blogs) {
    const currentAuthor = authors.find(
      (author) => author.author === blog.author
    );
    if (!authors.includes(currentAuthor)) {
      authors.push({ author: blog.author, blogs: 1 });
    } else {
      const otherAuthors = authors.filter(
        (author) => author.author !== currentAuthor.author
      );
      authors = [
        ...otherAuthors,
        { author: currentAuthor.author, blogs: currentAuthor.blogs + 1 },
      ];
    }
  }
  const highestBlogs = Math.max(...authors.map((author) => author.blogs));
  const authorWithMostBlogs = authors.find(
    (author) => author.blogs === highestBlogs
  );

  return authorWithMostBlogs;
};

const mostLikes = (blogs) => {
  let authors = [];
  for (const blog of blogs) {
    const currentAuthor = authors.find(
      (author) => author.author === blog.author
    );
    if (!authors.includes(currentAuthor)) {
      authors.push({ author: blog.author, likes: blog.likes });
    } else {
      const otherAuthors = authors.filter(
        (author) => author.author !== currentAuthor.author
      );
      authors = [
        ...otherAuthors,
        {
          author: currentAuthor.author,
          likes: currentAuthor.likes + blog.likes,
        },
      ];
    }
  }
  const highestLikes = Math.max(...authors.map((author) => author.likes));
  const authorWithMostLikes = authors.find(
    (author) => author.likes === highestLikes
  );

  return authorWithMostLikes;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
