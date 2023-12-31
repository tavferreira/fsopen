import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a,b) => b.likes - a.likes))
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

  const blogFormRef = useRef()

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

  const loginForm = () => (
    <Togglable buttonLabel='login'>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const addBlog = async (blogObject) => {
    try {
      const addedblog = await blogService.create(blogObject)
      setBlogs(blogs.concat({ ...addedblog, user: { name: user.name } }).sort((a,b) => b.likes - a.likes))
      setNotification(`a new blog ${addedblog.title} added`, 'info')
      blogFormRef.current.toggleVisibility()
    } catch ({ response }) {
      setNotification(response.data.error, 'error')
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const likeBlog = async (blog) => {
    try {
      await blogService.like(blog)
    } catch {
      setNotification('Something went wrong. Please try again.', 'error')
    }
  }

  const removeBlog = async (blogToDelete) => {
    if(window.confirm(`Remove blog ${blogToDelete.title}?`)){
      try {
        await blogService.remove(blogToDelete.id)
        setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
      } catch ({ response }) {
        setNotification(`Could not remove blog: ${response.data.error}`, 'error')
      }
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} type={notificationType} />
      {!user && loginForm()}
      {user && (
        <>
          <div><p>{user.name} logged in<button onClick={handleLogout}>logout</button></p>{blogForm()}</div>
          <br />
          {blogs.map(blog => {
            const isOwner = blog && user && blog.user.name === user.name

            return <Blog key={blog.id} blog={blog} ownedBlog={isOwner} actions={{ likeBlog,removeBlog }}/>})}</>)}
    </div>
  )
}

export default App
