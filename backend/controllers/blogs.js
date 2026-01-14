const blogRoute = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

blogRoute.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    logger.info('fetched all data')
    return response.status(200).json(blogs)

  } catch (error) {
    next(error)
  }
})

blogRoute.post('/', middleware.userExtractor, async (request, response, next) => {
  try {
    const body = request.body

    const user = await User.findById(request.user.id)
    if(!user){
      return response.status(400).json({ error: 'userId missing or not valid' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      $inc: { likes: body.likes },
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    logger.info('new blog added successfully')
    return response.status(201).json(savedBlog)

  } catch (error) {
    next(error)
  }
})

blogRoute.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  try {
    const id = request.params.id

    const user = await User.findById(request.user.id)
    if(!user) {
      logger.warn('userId missing or not valid')
      return response.status(404).json({ error: 'userId missing or not valid' })
    }

    const blog = await Blog.findById(id)

    if(!blog) {
      logger.warn('no blog found')
      return response.status(404).json({ message: 'no blog found' })
    }

    if(user.id.toString() !== blog.user.toString()) {
      logger.warn('user doesnot have permission to delete this blog')
      return response.status(403).json({ error: 'user doesnot have permission to delete this blog' })
    }

    await Blog.findByIdAndDelete(id)
    logger.info(`blog with id:${id} deleted`)
    return response.status(204).json()
  } catch (error) {
    next(error)
  }
})

blogRoute.put('/:id',middleware.userExtractor, async (request, response, next) => {
  try {
    const id = request.params.id
    const body = request.body

    const user = await User.findById(request.user.id)
    if(!user) {
      logger.warn('userId missing or not valid')
      return response.status(404).json({ error: 'userId missing or not valid' })
    }

    const blog = await Blog.findById(id).select('user')

    if(!blog) {
      logger.warn('no blog found')
      return response.status(404).json({ message: 'no blog found' })
    }

    if(user.id.toString() !== blog.user.toString()) {
      logger.warn('user doesnot have permission to update this blog')
      return response.status(403).json({ error: 'user doesnot have permission to update this blog' })
    }

    const newObject = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }

    const updatedNote = await Blog.findByIdAndUpdate(
      id,
      newObject,
      { new: true, runValidators: true }
    )

    return response.json(updatedNote)

  } catch (error) {
    next(error)
  }
})

module.exports = blogRoute