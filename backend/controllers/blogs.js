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

blogRoute.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id

    const deletedBlog = await Blog.findByIdAndDelete(id)

    if(!deletedBlog) {
      logger.warn('no blog found')
      return res.status(404).json({ message: 'no blog found' })
    }

    logger.info(`blog with id:${id} deleted`)
    return res.status(204).json()
  } catch (error) {
    next(error)
  }
})

blogRoute.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const { title, author, url, likes } = req.body

    if(!title || !url){
      logger.warn('body needs required fields title and url')
      return res.status(400).json({ message: 'body needs required fields title and url' })
    }

    const newObject = {
      title,
      author,
      url,
      likes
    }

    const updatedNote = await Blog.findByIdAndUpdate(
      id,
      newObject,
      { new: true, runValidator: true }
    )

    if(!updatedNote){
      logger.warn('No blog found with the id')
      return res.status(404).json({ error: 'No blog found with the id' })
    }

    return res.status(200).json(updatedNote)

  } catch (error) {
    next(error)
  }
})

module.exports = { blogRoute }