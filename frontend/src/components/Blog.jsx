import { useState } from "react"

const Blog = ({ blog, onLike }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 3,
    paddingBottom: 2,
    marginBottom: 3,
    border: 'solid',
    borderWidth: 1
  }

  const handleVisible = () => {
    setVisible(v => !v)
  }

  const handleLike = () => {
    onLike(blog)
  }

  return (
    <div style={blogStyle}>
      <div >
        {blog.title}
        <button onClick={handleVisible}>
          {visible ? 'hide' : 'show'}
        </button>
      </div>
      {visible && (
        <div>
          <a href={blog.url} target="_blank" rel="noreferrer">
            {blog.url}
          </a>
          <div>
            likes:{blog.likes}
            <button onClick={handleLike}>like</button>
            {''}
          </div>
          {blog.author}
        </div>
      )}
    </div>

  )
}

export default Blog