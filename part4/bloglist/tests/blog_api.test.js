const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

const users = [
  {
    username: 'root',
    password: 'secret'
  },
  {
    username: 'pepito',
    password: 'secreto'
  }
]

const getUserToken = async (index) => {
  const { username, password } = users[index]
  const login = await api
    .post('/api/login')
    .send({
      username,
      password
    })

  return login.body.token
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const initialUsers = [
    {
      username: users[0].username,
      name: 'Superuser',
      passwordHash: await bcrypt.hash(users[0].password, 10),
      id: '651898731cbc16a57cee82c6',
    },
    {
      username: users[1].username,
      name: 'Jose Manuel',
      passwordHash: await bcrypt.hash(users[1].password, 10),
      id: '6518aac06d3bd45dbc4cf510'
    }
  ]

  const userObjects = initialUsers.map(user => new User(user))
  const userPromiseArray = userObjects.map(user => user.save())
  await Promise.all(userPromiseArray)

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const blogPromiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(blogPromiseArray)
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
      likes: 0,
    }

    const postResponse = await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${await getUserToken(1)}` })
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
      .set({ Authorization: `Bearer ${await getUserToken(1)}` })
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
      .set({ Authorization: `Bearer ${await getUserToken(1)}` })
      .send(newBlog)
      .expect(400)
  })

  test('it should return 401 if missing token', async () => {
    const newBlog = {
      author: 'Margaret Atwood',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
})

describe('DELETE /api/blogs/:id', () => {
  test('it should delete blog with existing id if requested by owner', async () => {
    const id = helper.initialBlogs[0].id

    await api.delete(`/api/blogs/${id}`)
      .set({ Authorization: `Bearer ${await getUserToken(0)}` })
      .expect(204)
  })

  test('should return 404 if id does not exist ', async () => {
    const nonExistingId = await helper.nonExistingId()

    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .set({ Authorization: `Bearer ${await getUserToken(0)}` })
      .expect(404)
  })

  test('should return 401 if token is not provided', async () => {
    const id = helper.initialBlogs[0].id

    await api.delete(`/api/blogs/${id}`)
      .expect(401)
  })
})

describe('PUT /api/blogs/:id', () => {
  test('it should update likes for blog with existing id', async () => {
    const likes = 15
    const existingId = await helper.existingId()

    const response = await api.put(`/api/blogs/${existingId}`)
      .send({ likes })
      .expect(200)

    expect(response.body.likes).toBe(likes)
  })

  test('should return 400 if id does not exist ', async () => {
    const nonExistingId = await helper.nonExistingId()

    await api.put(`/api/blogs/${nonExistingId}`).send({ likes: 10 }).expect(404)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
}, 10000)
