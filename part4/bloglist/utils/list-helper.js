var _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((accumulator, currentValue) => accumulator + currentValue.likes, 0)
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0) return null

  return blogs.reduce((max,blog) => max.likes > blog.likes ? max : blog)
}

const mostBlogs = (blogs) => {
  if(blogs.length === 0) return null

  const groupByAuthorBlogs = _.groupBy(blogs,'author')
  const mostBlogsByAuthor = Object.entries(groupByAuthorBlogs).reduce((max,obj) => max.length > obj.length ? max : obj)

  return {
    author: mostBlogsByAuthor[0],
    blogs: mostBlogsByAuthor[1].length
  }
}

const mostLikes = (blogs) => {
  if(blogs.length === 0) return null

  const groupByAuthorBlogs = _.groupBy(blogs,'author')

  return Object
    .entries(groupByAuthorBlogs)
    .map(obj => ({
      'author': obj[0],
      'likes': totalLikes(obj[1])
    }))
    .reduce((max,blog) => max.likes > blog.likes ? max : blog)
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
