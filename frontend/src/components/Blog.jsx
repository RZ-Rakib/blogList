import { useState } from "react"

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? null : 'none' }
  const hideWhenVisible = { display: visible ? 'none' : null }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 3,
    paddingBottom: 3,
    marginBottom: 3,
    border: 'solid',
    borderWidth: 1
  }

  const handleVisible = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>

      <div style={hideWhenVisible}>
        {blog.title}<button onClick={handleVisible}>view</button>
      </div>
      <div style={showWhenVisible}>
        <div>
          {blog.title}<button onClick={handleVisible}>hide</button>
        </div>
        <div>
          <a href={blog.url} target="_blank" rel="noreferrer">
            {blog.url}
          </a>
          <div>
            likes:{blog.likes}
            <button>like</button>
            {''}
          </div>
          {blog.author}
        </div>
      </div>
    </div>

  )
}

export default Blog