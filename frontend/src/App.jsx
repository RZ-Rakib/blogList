import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notificationMessage, setNotificationMessage] = useState({ message: null, type: null })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('LoggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedUser = await loginService.login({ username, password })

      window.localStorage.setItem('LoggedBlogappUser', JSON.stringify(loggedUser))

      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      setUsername('')
      setPassword('')
      setNotificationMessage({ message: `${loggedUser.name} logged in successfully`, type: 'success' })
      setTimeout(() => {
        setNotificationMessage({ message: null, type: null })
      }, 3000);

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'something went wrong'
      setNotificationMessage({ message: errorMessage, type: 'error' })
      setTimeout(() => {
        setNotificationMessage({ message: null, type: null })
      }, 3000);
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('LoggedBlogappUser')
    setUser(null)
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()

    try {
      const newSavedNote = await blogService.create({ title, author, url })

      setBlogs(prevBlogs => prevBlogs.concat(newSavedNote))
      setTitle('')
      setAuthor('')
      setUrl('')
      setNotificationMessage({ message: `${newSavedNote.title} created successfully`, type: 'success' })
      setTimeout(() => {
        setNotificationMessage({ message: null, type: null })
      }, 3000);

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'something went wrong'
      setNotificationMessage({ message: errorMessage, type: 'error' })
      setTimeout(() => {
        setNotificationMessage({ message: null, type: null })
      }, 3000);
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }


  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notificationMessage.message} type={notificationMessage.type} />
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
          </div>
          <button type='submit'>Login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notificationMessage.message} type={notificationMessage.type} />
      <div>
        <a>{user.name} logged in</a>
        <button onClick={handleLogout}>logout</button>
      </div>
      <br />
      <h2>Create new</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          <label>
            title:
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              type="text"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              type="text"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
          </label>
        </div>
        <button type='submit'>create</button>
      </form>
      <br />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App