const express = require('express')
const mongoose = require('mongoose')
const { MONGODB_URI } = require('./utils/config')
const { info, error } = require('./utils/logger')
const middleware = require('./utils/middleware')
const { blogRoute } = require('./controllers/blogs')
//const Blog = require('./models/blog')
const app = express()

mongoose.connect(MONGODB_URI, { family: 4 })
  .then(async () => {
    info('Mongodb connected')
    //await Blog.deleteMany({})
  })
  .catch(err => {
    error('Server is failed to connect mongodb', err.message)
  })

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogRoute)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app