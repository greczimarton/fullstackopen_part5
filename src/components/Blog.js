import React, { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog }) => {
    const [view, setView] = useState(false)

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const updateThisBlog = () => {
        const updatedBlog = {
            id: blog.id,
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes + 1
        }
        updateBlog(updatedBlog)
    }

    const removeThisBlog = () => {
        window.confirm(`Remove blog '${blog.title}' by ${blog.author}`)
        console.log('blogtodelete', blog)
        deleteBlog(blog)
    }

    if (view) {
        return <div data-cy='blogComponent' style={blogStyle}>
            <p style={{ display: 'inline' }}>{blog.title} </p>
            <p style={{ display: 'inline' }}>{blog.author}</p>
            <button onClick={() => setView(!view)}>Hide</button>
            <br/>
            {blog.url}<br/>
            Likes: {blog.likes}
            <button onClick={() => updateThisBlog()}>Like</button>
            <br/>
            {typeof (blog.user) === typeof (undefined) ? 'Anon' : blog.user.name}
            <button onClick={() => removeThisBlog()}>Remove</button>
        </div>
    } else {
        return <div data-cy='blogComponent' style={blogStyle}>
            <p style={{ display: 'inline' }}>{blog.title} </p>
            <p style={{ display: 'inline' }}>{blog.author}</p>
            <button onClick={() => setView(!view)}>View</button>
        </div>
    }


}

export default Blog