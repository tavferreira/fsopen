const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'My new blog',
    author: 'Ernest Hemingway',
    url: 'www.hemingway.com/blog',
    likes: 1
  },
  {
    title: 'Fante\'s blog',
    author: 'John Fante',
    url: 'www.fantesblog.com',
    likes: 5
  },
  {
    title: 'Crazy stuff I\'ve wrote',
    author: 'Charles Bukowski',
    url: 'www.bukowskisgreat.com/my-blog',
    likes: 11
  },
]

const existingId = async () => {
  const blog = await Blog.findOne({ author: 'Ernest Hemingway' })

  return blog._id.toString()
}

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', url: 'www.domain.org' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, existingId, nonExistingId, blogsInDb, usersInDb
}
