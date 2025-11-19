// eslint-disable-next-line no-unused-vars
const dummy = (_blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (totalLikes, currentBlog) => {
    return totalLikes + currentBlog.likes
  }
  return blogs.reduce(reducer, 0)
}
// const blogs = [
//   { id: '5a422a851b54a676234d17f7',
//     title: 'React patterns',
//     author: 'Michael Chan',
//     url: 'https://reactpatterns.com/',
//     likes: 7,
//     __v: 0
//   },
//   {
//     _id: '5a422aa71b54a676234d17f8',
//     title: 'Go To Statement Considered Harmful',
//     author: 'Edsger W. Dijkstra',
//     url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
//     likes: 12,
//     __v: 0
//   },
//   {
//     _id: '5a422b3a1b54a676234d17f9',
//     title: 'Canonical string reduction',
//     author: 'Edsger W. Dijkstra',
//     url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
//     likes: 12,
//     __v: 0
//   },
//   {
//     _id: '5a422b891b54a676234d17fa',
//     title: 'First class tests',
//     author: 'Robert C. Martin',
//     url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
//     likes: 10,
//     __v: 0
//   }
// ]
const favouriteBlog = (blogs) => {
  if(blogs.length === 0){
    return null
  }
  const reducer = (max, blog) => {
    return blog.likes > max.likes ? blog : max
  }
  return blogs.reduce(reducer)
}

module.exports = { dummy, totalLikes, favouriteBlog }