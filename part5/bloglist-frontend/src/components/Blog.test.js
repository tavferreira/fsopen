import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author', () => {
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

  const { container } = render(<Blog blog={blog} />)

  const title = screen.getByText(blog.title, { exact: false })
  expect(title).toBeDefined()

  const author = screen.getByText(blog.author, { exact: false })
  expect(author).toBeDefined()

  const div = container.querySelector('.togglableContent')
  expect(div).toHaveStyle('display: none')
})
