import React, { useState } from 'react'

const BlogsForm = ({ addBlog }) => {
    const [title,setTitle] = useState('')
    const [author,setAuthor] = useState('')
    const [url,setUrl] = useState('')

    const addBlogSubmit = (event) => {
        event.preventDefault()
        const newObject = { title,author,url }
        addBlog(newObject)
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return <div className='formDiv'>
        <h2>Create new</h2>
        <form onSubmit={addBlogSubmit}>
            <div>
                Title: <input id="create-blog-from-title" type="text" value={title} name="Title"
                    onChange={({ target }) => setTitle(target.value)}/>
            </div>
            <div>
                Author: <input id="create-blog-from-author" type="text" value={author} name="Author"
                    onChange={({ target }) => setAuthor(target.value)}/>
            </div>
            <div>
                URL: <input id="create-blog-from-url" type="text" value={url} name="Url"
                    onChange={({ target }) => setUrl(target.value)}/>
            </div>
            <button id="create-blog-from-submit" type="submit">Add Blog</button>
        </form>
    </div>
}

export default BlogsForm