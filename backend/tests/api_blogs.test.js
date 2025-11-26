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

  test('a specific blog from returned blogs', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const response = await api.get('/api/blogs')

    const contents = response.body.map(blog => blog.title)
    assert(contents.includes(blogsAtStart[1].title))
  })

  test('verified that the unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')

    response.body.map(blog => {
      assert.ok(blog.id),
      assert.strictEqual(blog._id, undefined)
    })
  })

  test('success with a valid data', async () => {
    const newObject = {
      title: 'fsgfdsgdg string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 11,
    }

    const blogsAtStart = await helper.blogsInDb()

    await api
      .post('/api/blogs')
      .send(newObject)
      .expect(201)
      .expect('content-type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes(newObject.title))
  })

  test.only('dafult value is 0 if likes property is missing', async () => {
    const newObject = {
      'title': 'hello blog',
      'author': 'RZ Rakib',
      'url': 'www.example.com'
    }

    await api
      .post('/api/blogs')
      .send(newObject)
      .expect(201)
      .expect('content-type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd.find(blog => blog.title === newObject.title)
    assert.strictEqual(addedBlog.likes, 0)
  })

})

after(async () => {
  await mongoose.connection.close()
})