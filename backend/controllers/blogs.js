const blogRoute = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { SECRET } = require('../utils/config')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')

blogRoute.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    logger.info('fetched all data')
    return res.status(200).json(blogs)

  } catch (error) {
    next(error)
  }
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if(authorization && authorization.startsWith('Bearer ')){
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogRoute.post('/', async (request, response, next) => {
  try {
    const body = request.body

    const decodedToken = jwt.verify(getTokenFrom(request), SECRET)
    if(!decodedToken.id){
      return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)
    if(!user){
      return response.status(400).json({ error: 'userId missing or not valid' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
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

module.exports = blogRoute