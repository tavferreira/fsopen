const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { body } = request

  const user = await User.findById(body.userId)

  const blogData = {
    ...body,
    user: user.id,
    likes: body.likes || 0
  }
  const blog = new Blog(blogData)

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  const deletedNote = await Blog.findByIdAndDelete(id)

  if (deletedNote) {
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  const updatedNote = await Blog.findByIdAndUpdate(request.params.id, { likes }, { new: true })

  if (updatedNote) {
    response.json(updatedNote)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter
