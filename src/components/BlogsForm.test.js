import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogsForm from './BlogsForm'

test('<NoteForm /> updates parent state and calls onSubmit', () => {
    const createBlog = jest.fn()

    const component = render(
        <BlogsForm addBlog={createBlog}/>
    )

    const author = component.container.querySelector('#author')
    const form = component.container.querySelector('form')

    fireEvent.change(author, {
        target: { value: 'Homer Simpson' }
    })
    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].author).toBe('Homer Simpson')

})