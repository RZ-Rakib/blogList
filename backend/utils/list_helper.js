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


module.exports = { dummy, totalLikes }