import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const setNotification = (message, type) => {
    setNotificationMessage(message)
    setNotificationType(type)
  }

  const clearNotification = () => {
    return setTimeout(() => {
      setNotificationMessage(null)
      setNotificationType(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch ({ response }) {
      setNotification(response.data.error, 'error')
      clearNotification()
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    window.location.reload()
  }

  const addBlog = async (e) => {
    e.preventDefault()
    try {
      const addedBlog = await blogService.create({ title: blogTitle, author: blogAuthor, url: blogUrl })
      setNotification(`a new blog ${addedBlog.title} added`, 'info')
    } catch ({ response }) {
      setNotification(response.data.error, 'error')
    }
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notificationMessage} type={notificationType} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} type={notificationType} />
      <p>{user.name} logged in<button onClick={handleLogout}>logout</button></p>
      <form onSubmit={addBlog}>
        <div>
          Title: <input
            value={blogTitle}
            onChange={({ target }) => setBlogTitle(target.value)}
          />
        </div>
        <div>
          Author: <input
            value={blogAuthor}
            onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </div>
        <div>
          URL: <input
            value={blogUrl}
            onChange={({ target }) => setBlogUrl(target.value)}
          />
        </div>
        <button type="submit">save</button>
      </form>
      <br />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
