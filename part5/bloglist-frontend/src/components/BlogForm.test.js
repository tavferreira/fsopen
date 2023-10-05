import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

describe('BlogForm', () => {
  const newBlog = {
    title: 'This is a title',
    author: 'This is the author',
    url: 'This is the URL'
  }

  test('form calls the event handler with the right details', async () => {
    const mockCreateBlog = jest.fn()
    const user = userEvent.setup()
    render(<BlogForm createBlog={mockCreateBlog} />)

    const titleInput = screen.getByPlaceholderText('title')
    const authorInput = screen.getByPlaceholderText('author')
    const urlInput = screen.getByPlaceholderText('url')
    const sendButton = screen.getByText('save')

    await user.type(titleInput, newBlog.title)
    await user.type(authorInput, newBlog.author)
    await user.type(urlInput, newBlog.url)
    await user.click(sendButton)

    expect(mockCreateBlog.mock.calls).toHaveLength(1)
    expect(mockCreateBlog.mock.calls[0][0]).toStrictEqual(newBlog)
  })
})
