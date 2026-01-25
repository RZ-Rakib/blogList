import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog'

describe('<Blog />', () => {
  let mockLike, mockDelete
  beforeEach(() => {
    const blog = {
      title: 'Testing club',
      author: 'RZ Rakib',
      url: 'www.testing.com',
      likes: 2,
      user: {
        id: '123'
      }
    }

    mockLike = vi.fn()
    mockDelete = vi.fn()

    render(
      <Blog
        blog={blog}
        user={blog.user}
        onLike={mockLike}
        onDelete={mockDelete}
      />
    )
  })

  test('renders blog\'s title and author, and doesnot renders url and likes by default', async () => {
    const title = screen.getByText(/Testing club/i)
    const author = screen.getByText(/RZ Rakib/i)
    const url = screen.queryByText(/www.testing.com/i)
    const likes = screen.queryByText(/likes:/i)

    expect(title).toBeInTheDocument()
    expect(author).toBeInTheDocument()
    expect(url).not.toBeInTheDocument()
    expect(likes).not.toBeInTheDocument()
  })

  test('url & likes shows by pressing show button', async () => {
    const user = userEvent.setup()

    const showButton = screen.getByRole('button', { name: 'show' })
    await user.click(showButton)

    const url = screen.getByRole('link', { name: /www.testing.com/i })
    const likes = screen.getByText(/likes:/i)

    expect(url).toBeDefined()
    expect(likes).toBeDefined()
  })
})