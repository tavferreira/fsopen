const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'My new blog',
    author: 'Ernest Hemingway',
    url: 'www.hemingway.com/blog',
    likes: 1,
    id: '65189bda3cb493ec3afe48a7',
    user: '651898731cbc16a57cee82c6',
  },
  {
    title: 'Fante\'s blog',
    author: 'John Fante',
    url: 'www.fantesblog.com',
    likes: 5,
    id: '651877071a6d64bbcca33b8b',
    user: '651898731cbc16a57cee82c6',
  },
  {
    title: 'Crazy stuff I\'ve wrote',
    author: 'Charles Bukowski',
    url: 'www.bukowskisgreat.com/my-blog',
    likes: 11,
    id: '6518ab787808d8db33457934',
    user: '6518aac06d3bd45dbc4cf510'
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
