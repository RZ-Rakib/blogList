const blogRoute = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')


blogRoute.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find({})
    logger.info('fetched all data')
    return res.status(200).json(blogs)

  } catch (error) {
    next(error)
  }
})

blogRoute.post('/', async (req, res, next) => {
  try {
    const blog = new Blog(req.body)

    const result = await blog.save()

    logger.info('new blog added successfully')
    return res.status(201).json(result)

  } catch (error) {
    next(error)
  }
})

module.exports = { blogRoute }