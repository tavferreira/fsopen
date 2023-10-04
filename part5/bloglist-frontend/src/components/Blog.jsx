import { useState } from 'react'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

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
  console.log(blog.user)
  return (
  <div style={blogStyle}>
    {blog.title} {blog.author} <button onClick={toggleVisibility}>view</button>
    <div style={{ display: visible ? '' : 'none'}}>
      <div>{blog.url}</div>
      <div>likes {blog.likes}</div>
      {blog.user && blog.user.name && <div>blog.user.name</div>}
    </div>
  </div>  
)}

export default Blog
