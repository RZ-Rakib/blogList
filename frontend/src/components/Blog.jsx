import { useState } from 'react'

const Blog = ({ blog, user, onLike, onDelete }) => {
  const [visible, setVisible] = useState(false)

  const blogOwnerId = blog.user?.id
  const loggedUserId = user?.id

  const validOwnerToRemove = blogOwnerId && loggedUserId && blogOwnerId.toString() === loggedUserId.toString()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 3,
    paddingBottom: 2,
    marginBottom: 3,
    border: 'solid',
    borderRadius: 4,
    borderWidth: 1
  }

  const removeButton = {
    backgroundColor: 'red',
    color: 'white',
    borderRadius: 4,
    borderWidth: 1
  }

  const handleVisible = () => {
    setVisible(v => !v)
  }

  const handleLike = () => {
    onLike(blog)
  }
  const handleDelete = () => {
    onDelete(blog)
  }

  return (
    <div style={blogStyle} >
      <div >
        {blog.title}{' '}
        <button onClick={handleVisible}>
          {visible ? 'hide' : 'show'}
        </button>
        <br />
        {blog.author}
      </div>
      {visible && (
        <div >
          <a href={blog.url} target="_blank" rel="noreferrer">
            {blog.url}
          </a>
          <div>
            likes:{blog.likes} {''}
            <button onClick={handleLike}>like</button>
            {''}
          </div>
          <div>
            {validOwnerToRemove && (
              <button style={removeButton} onClick={handleDelete}>remove</button>
            )}
          </div>
        </div>
      )}
    </div>

  )
}

export default Blog