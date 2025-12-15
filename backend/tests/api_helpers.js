const Blog = require('../models/blog')
const User = require('../models/user')

//blogs
const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  }
]


const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Godzilla is coming back',
    author: 'Rakib',
    url: 'www.jhdk.com',
    likes: 2
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

// users
const initialUsers = [
  {
    username: 'MRZ',
    name: 'Rakib Zaman',
    password: '12345'
  },
  {
    username: 'Godzilla',
    name: 'James Bond',
    password: '123456'
  }
]
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = { initialBlogs, blogsInDb, nonExistingId, initialUsers, usersInDb }