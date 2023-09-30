const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

//...

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  describe.only('user validation', () => {
    test('username should have at least 3 chars', async () => {
      const newUser = {
        username: 'ml',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
      expect(response.body.error).toEqual('User validation failed: username: Path `username` (`ml`) is shorter than the minimum allowed length (3).')
    })

    test('username is required', async () => {
      const newUser = {
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
      expect(response.body.error).toEqual('User validation failed: username: Path `username` is required.')
    })

    test('username should have at least 3 chars', async () => {
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'sa',
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
      expect(response.body.error).toEqual('User validation failed: password is shorter than the minimum allowed length (3)')
    })

    test('username is required', async () => {
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
      expect(response.body.error).toEqual('User validation failed: password is required')
    })
  })
})
