const User = require('../models/user')
const logger = require('../utils/logger')
const bcrypt = require('bcrypt')
const userRoute = require('express').Router()

userRoute.post('/', async(request, response, next) => {
  try {
    const { username, name, password } = request.body

    if(!password){
      logger.warn('password required')
      return response.status(400).json({ error: 'password required' })
    }

    if(password.length < 3) {
      logger.warn('minimum length of password is three characters')
      return response.status(400).json({ error:'minimum length of password is three characters' })
    }

    const saltRound = 10
    const passwordHash = await bcrypt.hash(password, saltRound)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()

    logger.info('new user created sucessfully')
    return response.status(201).json(savedUser)

  } catch (error) {
    console.log('FULL ERROR OBJECT:', error)
    console.log('NAME:', error.name)
    console.log('CODE:', error.code)
    next(error)
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

module.exports = userRoute