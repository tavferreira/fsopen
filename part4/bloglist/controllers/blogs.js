const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { body, user } = request

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

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const id = request.params.id

  const user = request.user

  const blog = await Blog.findById(id)

  if(!blog) response.status(404).end()

  if(blog.user.toString() === user.id.toString()) {
    await Blog.deleteOne({ id })
    response.status(204).end()
  } else {
    response.status(401).json({ error: 'token invalid' })
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
