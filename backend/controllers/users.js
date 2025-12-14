const User = require('../models/user')
const logger = require('../utils/logger')
const bcrypt = require('bcrypt')
const userRoute = require('express').Router()

userRoute.post('/', async(request, response, next) => {
  try {
    const { username, name, password } = request.body

    const saltRound = 10
    const hashedPassword = await bcrypt.hash(password, saltRound)

    const user = new User({
      username,
      name,
      hashedPassword
    })

    const savedUser = await user.save()

    logger.info('new user created sucessfully')
    return response.status(201).json(savedUser)

  } catch (error) {
    next(error)
    logger.error('Error found:', error.message)
  }
})

userRoute.get('/', async (request, response, next) => {
  try {
    const users = await User.find({})

    logger.info('Users fetched sucessfully')
    response.json(users)
  } catch (error) {
    next(error)
  }

})

module.exports = { userRoute }