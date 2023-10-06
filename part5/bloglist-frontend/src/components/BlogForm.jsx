import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const addBlog = (e) => {
    e.preventDefault()
    createBlog({ title: blogTitle, author: blogAuthor, url: blogUrl })
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          Title: <input
            id="title"
            value={blogTitle}
            onChange={({ target }) => setBlogTitle(target.value)}
            placeholder='title'
          />
        </div>
        <div>
          Author: <input
            id="author"
            value={blogAuthor}
            onChange={({ target }) => setBlogAuthor(target.value)}
            placeholder='author'
          />
        </div>
        <div>
          URL: <input
            id="url"
            value={blogUrl}
            onChange={({ target }) => setBlogUrl(target.value)}
            placeholder='url'
          />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default BlogForm
