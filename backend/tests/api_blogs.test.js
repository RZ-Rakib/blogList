const supertest = require('supertest')
const assert = require('node:assert')
const { describe, test, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./api_blogs_helper')

const api = supertest(app)

describe('When there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('all blogs returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('content-type', /application\/json/)
  })

  test('all blogs returned successfully', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test.only('a specific blog from returned blogs', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const response = await api.get('/api/blogs')

    const contents = response.body.map(blog => blog.title)
    assert(contents.includes(blogsAtStart[1].title))
  })
})

after(async () => {
  await mongoose.connection.close()
})