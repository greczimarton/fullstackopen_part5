import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
    let component
    let likeMockHandler = jest.fn()

    beforeEach(() => {
        const blog = {
            'title': 'React patterns',
            'author': 'Michael Chan',
            'url': 'https://reactpatterns.com/',
            'likes': 7,
        }
        component = render(
            <Blog blog={blog} updateBlog={likeMockHandler}/>
        )
    })

    test('renders content', () => {
        expect(component.container).toHaveTextContent(
            'React patterns'
        )

        expect(component.container).toHaveTextContent(
            'Michael Chan'
        )

        expect(component.container).not.toHaveTextContent(
            'https://reactpatterns.com/'
        )

        expect(component.container).not.toHaveTextContent(
            'likes'
        )

        expect(component.container).not.toHaveTextContent(
            '7'
        )

    })

    test('url and likes are shown after \'Show\' is clicked', () => {
        const button = component.getByText('View')
        fireEvent.click(button)

        expect(component.container).toHaveTextContent(
            'https://reactpatterns.com/'
        )

        expect(component.container).toHaveTextContent(
            'Likes'
        )
        expect(component.container).toHaveTextContent(
            '7'
        )
    })

    test('like button pressed twice, updateBlog(with likes++) is called twice', () => {
        const viewButton = component.getByText('View')
        fireEvent.click(viewButton)
        const likeButton = component.getByText('Like')
        fireEvent.click(likeButton)
        fireEvent.click(likeButton)

        expect(likeMockHandler.mock.calls).toHaveLength(2)
    })
})
