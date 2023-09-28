const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((accumulator, currentValue) => accumulator + currentValue.likes, 0)
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0) return null
  return blogs.reduce((max,blog) => max.likes > blog.likes ? max : blog)
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}
