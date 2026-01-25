import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from '../components/NewBlogForm'

describe('< NewBlogForm />', () => {
  test('checks all input fields and calls onSubmit event handler', async () => {
    const user = userEvent.setup()
    const mockCreateBlog = vi.fn()

    render(<NewBlogForm createBlog={mockCreateBlog} />)

    const titleInput = screen.getByLabelText(/title/i)
    const authorInput = screen.getByLabelText(/author/i)
    const urlInput = screen.getByLabelText(/url/i)

    await user.type(titleInput, 'React Testing')
    await user.type(authorInput, 'RZ Rakib')
    await user.type(urlInput, 'www.testing.com')

    const submitButton = screen.getByRole('button', { name: /create/i })
    await user.click(submitButton)

    expect(mockCreateBlog.mock.calls).toHaveLength(1)
    expect(mockCreateBlog.mock.calls[0][0]).toEqual({
      title: 'React Testing',
      author: 'RZ Rakib',
      url: 'www.testing.com'
    })
  })
})