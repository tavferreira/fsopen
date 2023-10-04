import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)
  const [blogToRender, setBlogToRender] = useState(blog)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  
  const likeBlog = async (blog) => {
    await blogService.like(blog)
    setBlogToRender({...blog,likes: blog.likes + 1})
  }

  return (
  <div style={blogStyle}>
    {blogToRender.title} {blogToRender.author} <button onClick={toggleVisibility}>view</button>
    <div style={{ display: visible ? '' : 'none'}}>
      <div>{blogToRender.url}</div>
      <div>likes {blogToRender.likes} <button onClick={() => likeBlog(blogToRender)}>like</button></div>
      <div>{blogToRender.user.name}</div>
    </div>
  </div>  
)}

export default Blog
