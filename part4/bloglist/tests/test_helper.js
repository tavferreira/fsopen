const Blog = require('../models/blog')

const initialBlogs = [
  {
    author: 'Ernest Hemingway',
    url: 'www.hemingway.com/blog',
    likes: 1
  },
  {
    author: 'John Fante',
    url: 'www.fantesblog.com',
    likes: 5
  },
  {
    author: 'Charles Bukowski',
    url: 'www.bukowskisgreat.com/my-blog',
    likes: 11
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}
