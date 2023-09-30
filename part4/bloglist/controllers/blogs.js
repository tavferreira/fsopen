const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  await Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/', async (request, response) => {
  const { body } = request
  const blogData = {
    ...body,
    likes: body.likes || 0
  }
  const blog = new Blog(blogData)

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  await Blog
    .findByIdAndDelete(id)
    .then(() => {
      response.status(204).end()
    })
})

module.exports = blogsRouter
