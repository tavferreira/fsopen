const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')

    response.body.map(blog => expect(blog.id).toBeDefined())
  })
})

describe('POST /api/blogs', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'How I wrote Foundation',
      author: 'Isaac Asimov',
      url: 'www.asimov.com/thoughts',
      likes: 0
    }

    const postResponse = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(postResponse.body).toMatchObject(newBlog)

    const getResponse = await api.get('/api/blogs')
    expect(getResponse.body).toHaveLength(helper.initialBlogs.length + 1)
  })

  test('when adding new note, if likes prop is missing it defaults to 0', async () => {
    const newBlog = {
      title: 'Reflections',
      author: 'Margaret Atwood',
      url: 'www.matwood.com/blog',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(0)

  })

  test('it should return 400 if missing title or url', async () => {
    const newBlog = {
      author: 'Margaret Atwood',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

describe('DELETE /api/blogs/:id', () => {
  test('it should delete blog with existing id', async () => {
    const response = await api
      .get('/api/blogs')

    const id = response.body[0].id

    await api.delete(`/api/blogs/${id}`).expect(204)
  })

  test('should return 400 if id does not exist ', async () => {
    await api.delete(`/api/blogs/${helper.nonExistingId}`).expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
}, 10000)
