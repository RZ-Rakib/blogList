const supertest = require('supertest')
const assert = require('node:assert')
const { describe, test, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./api_helpers')

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

  describe('addtion of a new blog', () => {
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

    test('dafult value is 0 if likes property is missing', async () => {
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

    test('fails with statuscode 400 if url is missing', async () => {
      const newObject = {
        'title': 'hello blog',
        'author': 'RZ Rakib',
        'likes': 3
      }

      await api
        .post('/api/blogs')
        .send(newObject)
        .expect(400)
    })

    test('fails with statuscode 400 if title is missing', async () => {
      const newObject = {
        'author': 'RZ Rakib',
        'url': 'www.example.com',
        'likes': 3
      }

      await api
        .post('/api/blogs')
        .send(newObject)
        .expect(400)
    })
  })

  describe('deletion of blog', () => {
    test('success with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()

      await api
        .delete(`/api/blogs/${blogsAtStart[blogsAtStart.length - 1].id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    })

    test('fails with status code 400 if id invalid', async () => {
      const invalidId = 'lksdjf54342525'

      await api
        .delete(`/api/blogs/${invalidId}`)
        .expect(400)
    })

    test('fails with status code 404 if blog doesnot exists', async () => {
      const nonExistingId = await helper.nonExistingId()

      await api
        .delete(`/api/blogs/${nonExistingId}`)
        .expect(404)
    })
  })

  describe('Updation a blog', () => {
    test('success with status code 200 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const newObject = {
        'title': 'this is a updated blog',
        'url': 'www.hello.com'
      }

      await api
        .put(`/api/blogs/${blogsAtStart[1].id}`)
        .send(newObject)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const titles = blogsAtEnd.map(blog => blog.title)
      const urls = blogsAtEnd.map(blog => blog.url)

      assert(titles.includes(newObject.title))
      assert(urls.includes(newObject.url))
    })
  })

  test('fails with status code 400 if newObject doesnot contains title and url', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newObject = {
      'author': 'RZ Rakib',
      'likes': 3
    }

    await api
      .put(`/api/blogs/${blogsAtStart[1].id}`)
      .send(newObject)
      .expect(400)
  })

  test('fails with status code 404 if no blog found with id', async () => {
    const nonExistingId = await helper.nonExistingId()

    const newObject = {
      'title': 'this is a updated blog',
      'url': 'www.hello.com'
    }

    await api
      .put(`/api/blogs/${nonExistingId}`)
      .send(newObject)
      .expect(404)
  })

  test('fails with status code 400 if id invalid', async () => {
    const invalidId = 'dsfki345346436'

    const newObject = {
      'title': 'this is a updated blog',
      'url': 'www.hello.com'
    }

    await api
      .put(`/api/blogs/${invalidId}`)
      .send(newObject)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})