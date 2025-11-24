const blogRoute = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')


blogRoute.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  logger.info('fetched all data')
  return response.status(200).json(blogs)
})

blogRoute.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

module.exports = { blogRoute }