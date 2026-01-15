import { useState, useEffect, useRef } from 'react'
import { jwtDecode } from 'jwt-decode'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import signupService from './services/signup'
import Notification from './components/Notification'
import NewBlogFrom from './components/NewBlogFrom'
import Toggleable from './components/Toggleable'
import Auth from './components/Auth'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState({ message: null, type: null })

  const authRef = useRef(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('LoggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)

      const decodedToken = jwtDecode(user.token)
      const userWithDecodedToken = { ...user, id: decodedToken.id }
      setUser(userWithDecodedToken)

      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const loggedUser = await loginService.login({ username, password })

      const decodedToken = jwtDecode(loggedUser.token)
      const userWithDecodedToken = { ...loggedUser, id: decodedToken.id }

      window.localStorage.setItem('LoggedBlogappUser', JSON.stringify(userWithDecodedToken))

      blogService.setToken(loggedUser.token)
      setUser(userWithDecodedToken)

      setNotificationMessage({ message: `${loggedUser.name} logged in successfully`, type: 'success' })
      setTimeout(() => {
        setNotificationMessage({ message: null, type: null })
      }, 3000)

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'something went wrong'
      setNotificationMessage({ message: errorMessage, type: 'error' })
      setTimeout(() => {
        setNotificationMessage({ message: null, type: null })
      }, 3000)
    }
  }

  const handleSignup = async (username, name, password) => {
    try {
      const newUser = await signupService.signup({ username, name, password })

      setNotificationMessage({ message: `${newUser.name} created sucessfully!`, type: 'success' })
      setTimeout(() => {
        setNotificationMessage({ message: null, type: null })
      }, 3000)

      authRef.current.handleAuthToggle()

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Something went wrong'
      setNotificationMessage({ message: errorMessage, type: 'error' })
      setTimeout(() => {
        setNotificationMessage({ message: null, type: null })
      }, 3000)
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('LoggedBlogappUser')
    setUser(null)
  }

  const handleNewBlog = async (title, author, url) => {

    try {
      const newSavedNote = await blogService.create({ title, author, url })


      const normalized = {
        ...newSavedNote,
        user: { id: user.id }
      }

      setBlogs(prevBlogs => prevBlogs.concat(normalized))

      setNotificationMessage({ message: `${newSavedNote.title} created successfully`, type: 'success' })
      setTimeout(() => {
        setNotificationMessage({ message: null, type: null })
      }, 3000)

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'something went wrong'
      setNotificationMessage({ message: errorMessage, type: 'error' })
      setTimeout(() => {
        setNotificationMessage({ message: null, type: null })
      }, 3000)
    }
  }

  const handleLike = async (blog) => {
    try {
      const updatedObject = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: blog.user.id
      }

      const updatedBlog = await blogService.update(blog.id, updatedObject)

      setBlogs(prev => prev.map(blog => (blog.id === updatedBlog.id ? updatedBlog : blog)))

    } catch (error) {
      const errorMesssage = error.response?.data?.error || 'something went wrong'

      setNotificationMessage({ message: errorMesssage, type: 'error' })
      setTimeout(() => {
        setNotificationMessage({ message: null, type: null })
      }, 3000)
    }
  }

  const handleDelete = async (blog) => {
    try {
      if (window.confirm(`Remove blog ${blog.title} ?`)) {
        await blogService.remove(blog.id)

        setBlogs(prev => prev.filter(b => b.id !== blog.id))
      } else {
        console.log('User selected no')
      }
    } catch (error) {
      const errorMessage = error.response?.data.error || 'Something went wrong'
      setNotificationMessage({ message: errorMessage, type: 'error' })

      setTimeout(() => {
        setNotificationMessage({ message: null, type: null })
      }, 3000)
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => (b.likes - a.likes))

  if (user === null) {
    return (
      <div>
        <Notification message={notificationMessage.message} type={notificationMessage.type} />
        <Auth
          handleLogin={handleLogin}
          handleSignup={handleSignup}
          ref={authRef}
        />
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

      <hr />
      <Toggleable buttonLabel='Create new blog'>
        <NewBlogFrom createBlog={handleNewBlog} />
      </Toggleable>

      <br />
      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} onLike={handleLike} onDelete={handleDelete} />
      )}
    </div>
  )
}

export default App