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

mongoose.connect(MONGODB_URI, { family: 4 })
  .then(async () => {
    info('Mongodb connected')
    // await Blog.deleteMany({})
    // await User.deleteMany({})
  })
  .catch(err => {
    error('Server is failed to connect mongodb', err.message)
  })

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogRoute)
app.use('/api/users', userRoute)
app.use('/api/login', loginRoute)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app