const express = require('express')
const mongoose = require('mongoose')
const { MONGODB_URI } = require('./utils/config')
const { info, error } = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogRoute = require('./controllers/blogs')
const userRoute = require('./controllers/users')
const loginRoute = require('./controllers/login')
// const Blog = require('./models/blog')
// const User = require('./models/user')
const app = express()
const mongoConnection = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { family: 4 })
    info('Mongodb connected')
  } catch (err) {
    error('server is failed to connect', err)
    process.exit(1)
  }
}
mongoConnection()


app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogRoute)
app.use('/api/users', userRoute)
app.use('/api/login', loginRoute)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app