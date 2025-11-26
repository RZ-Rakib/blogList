const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    minLength:[3, 'minimum 3 charecters'],
    required: [true, 'title required'],
    unique: [true, 'title must be unique']
  },
  author: String,
  url: {
    type: String,
    required: [true, 'url required']
  },
  likes: {
    type: Number,
    default: 0
  },
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)

