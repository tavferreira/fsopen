import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('Blog', () => {
  const blog = {
    'title': 'Another blog',
    'author': 'El Influencer',
    'url': 'www.miblogeslahostia.com',
    'likes': 13,
    'user': {
      'username': 'root',
      'name': 'Superuser',
      'id': '651898731cbc16a57cee82c6'
    },
    'id': '65189bda3cb493ec3afe48a7'
  }

  const mockActions = {
    likeBlog: jest.fn(),
    removeBlog: jest.fn()
  }

  test('renders title and author', () => {
    const { container } = render(<Blog blog={blog} />)

    const title = screen.getByText(blog.title, { exact: false })
    expect(title).toBeDefined()

    const author = screen.getByText(blog.author, { exact: false })
    expect(author).toBeDefined()

    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', async () => {
    const { container } = render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')

    const url = screen.getByText(blog.url)
    expect(url).toBeDefined()

    const likes = screen.getByText(`likes ${blog.likes}`)
    expect(likes).toBeDefined()
  })

  test('clicking the like twice event handler should be called twice', async () => {
    render(<Blog blog={blog} actions={mockActions}/>)


    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockActions.likeBlog.mock.calls).toHaveLength(2)
  })
})
