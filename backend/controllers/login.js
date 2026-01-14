const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const logger = require('../utils/logger')
const { SECRET } = require('../utils/config')
const loginRoute = require('express').Router()

loginRoute.post('/', async (request, response, next) => {
  try {
    const { username, password } = request.body

    const user =  await User.findOne({ username })
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)

    if(!( user && passwordCorrect)) {
      logger.warn('invalid username or password')
      return response.status(401).json({ error: 'invalid username or password' })
    }

    const userForToken = {
      username: user.username,
      id: user._id
    }

    const token = jwt.sign(userForToken, SECRET, { expiresIn: '1h' })

    response
      .status(201)
      .json({
        token,
        username: user.username,
        name: user.name
      })
  } catch (error) {
    next(error)
  }
})

module.exports = loginRoute