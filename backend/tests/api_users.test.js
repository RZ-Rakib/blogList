const supertest = require('supertest')
const assert = require('node:assert')
const { describe, test, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const app = require('../app')
const helper = require('./api_helpers')

const api = supertest(app)

describe('Where there is initially some users saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const usersWithPassswordHash = []

    for(let user of helper.initialUsers) {
      const passwordHash = await bcrypt.hash(user.password, 10)
      usersWithPassswordHash.push({
        username: user.username,
        name: user.name,
        passwordHash
      })
    }

    await User.insertMany(usersWithPassswordHash)
  })

  test('returned all users as JSON', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('content-type', /application\/json/)

  })

  test('returned all users', async () => {
    const usersInDb = await helper.usersInDb()

    const response = await api
      .get('/api/users')
      .expect('content-type', /application\/json/)

    assert.strictEqual(usersInDb.length, response.body.length)
  })

  describe('addition of a new user', () => {
    test('success with a valid data', async () => {
      const usersAtStart = await helper.usersInDb()

      const newObject = {
        username: 'penguin',
        name: 'Ocean Blue',
        password: '1234567'
      }

      await api
        .post('/api/users')
        .send(newObject)
        .expect(201)
        .expect('content-type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtStart.length + 1, usersAtEnd.length )
      assert(usersAtEnd.map(user => user.username).includes(newObject.username))

    })

    test('fails with 400, if a username is not unique', async () => {
      const usersAtStart = await helper.usersInDb()

      const newObject = {
        username: helper.initialUsers[0].username,
        name: 'Rakib Zaman',
        password: '123345'
      }

      await api
        .post('/api/users')
        .send(newObject)
        .expect(400)
        .expect('content-type', /application\/json/)
        .expect( response => {
          assert(response.body.error.includes('username must be unique'))
        }
        )

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('fails with 400, if username is missing', async () => {
      const usersAtStart = await helper.usersInDb()

      const newObject = {
        name: 'Rakib Zaman',
        password: '123345'
      }

      await api
        .post('/api/users')
        .send(newObject)
        .expect(400)
        .expect('content-type', /application\/json/)
        .expect(response => {
          assert(response.body.error.includes('username required'))
        })

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('fails with 400, if password is missing', async () => {
      const usersAtStart = await helper.usersInDb()

      const newObject = {
        username: 'Gorilla',
        name: 'Amazon Rainforest'
      }

      await api
        .post('/api/users')
        .send(newObject)
        .expect(400)
        .expect('content-type', /application\/json/)
        .expect( response => {
          assert(response.body.error.includes('password required'))
        })

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
      assert(!usersAtEnd.map(u => u.username).includes(newObject.username))
    })

    test('fails with 400, if username\'s length is shorter than 3', async () => {
      const usersAtStart = await helper.usersInDb()

      const newObject = {
        username: 'Go',
        name: 'Amazon Rainforest',
        password: '123443'
      }

      await api
        .post('/api/users')
        .send(newObject)
        .expect(400)
        .expect('content-type', /application\/json/)
        .expect(response => {
          assert(response.body.error.includes('minimum length 3 characters'))
        })

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
      assert(!usersAtEnd.map(u => u.username).includes(newObject.username))
    })

    test('fails with 400, if password\'s length is shorter than 3', async () => {
      const usersAtStart = await helper.usersInDb()

      const newObject = {
        username: 'Gorillll',
        name: 'Amazon Rainforest',
        password: '12'
      }

      await api
        .post('/api/users')
        .send(newObject)
        .expect(400)
        .expect('content-type', /application\/json/)
        .expect(response => {
          assert(response.body.error.includes('minimum length of password is three characters'))
        })

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
      assert(!usersAtEnd.map(u => u.username).includes(newObject.username))
    })
  })

})
after(async () => {
  await mongoose.connection.close()
})
