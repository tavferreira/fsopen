import { useState } from 'react'

const Blog = ({ blog, ownedBlog, actions }) => {
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

  const updateLike = (blog) => {
    actions.likeBlog(blogToRender)
    setBlogToRender({ ...blog,likes: blog.likes + 1 })

  }

  return (
    <div className="blog" style={blogStyle}>
      {blogToRender.title} {blogToRender.author} <button onClick={toggleVisibility}>view</button>
      <div style={{ display: visible ? '' : 'none' }} className="togglableContent">
        <div className="url">{blogToRender.url}</div>
        <div className="likes">likes {blogToRender.likes} <button onClick={() => updateLike(blogToRender)}>like</button></div>
        <div>{blogToRender.user.name}</div>
        {ownedBlog && <div><button onClick={() => actions.removeBlog(blogToRender)}>remove</button></div>}
      </div>
    </div>
  )}

export default Blog
