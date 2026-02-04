import { useState, useEffect, useRef } from 'react'
import { jwtDecode } from 'jwt-decode'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import signupService from './services/signup'
import Notification from './components/Notification'
import NewBlogFrom from './components/NewBlogForm'
import Toggleable from './components/Toggleable'
import Auth from './components/Auth'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState({ message: null, type: null })
  //useRef
  const authRef = useRef(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  console.log('before:', blogs)



  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('LoggedBlogappUser')

    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)

      const decodedToken = jwtDecode(loggedUser.token)
      const userWithDecodedToken = { ...loggedUser, id: decodedToken.id }
      setUser(userWithDecodedToken)

      blogService.setToken(loggedUser.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const loggedUser = await loginService.login({ username, password })

      const decodedToken = jwtDecode(loggedUser.token)
      const userWithDecodedTokenID = { ...loggedUser, id: decodedToken.id }

      window.localStorage.setItem('LoggedBlogappUser', JSON.stringify(userWithDecodedTokenID))

      blogService.setToken(loggedUser.token)
      setUser(userWithDecodedTokenID)

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

  const handleNewBlog = async ({ title, author, url }) => {
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
      const updatedBlog = await blogService.likeIncrement(blog.id)
      console.log('updated Blog', updatedBlog);


      setBlogs(prev => prev.map(b => (b.id === blog.id ? updatedBlog : b)))
      console.log('after updated blogs', blogs);


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