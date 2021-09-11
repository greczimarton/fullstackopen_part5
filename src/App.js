import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Toggleable from './components/Toggleable'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogsForm from './components/BlogsForm'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState(null)
    const [messageBad, setMessageBad] = useState(false)
    const blogFormRef = useRef()


    useEffect(async () => {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
        if (loggedUserJSON) {
            const user = (JSON.parse(loggedUserJSON))
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const handleLogin = async ({ username,password }) => {
        try {
            const user = await loginService.login({ username,password })

            window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

            blogService.setToken(user.token)
            setUser(user)
            sendMessage(`Successful login. Welcome back ${user.name}`,false,5000)

        } catch (exception) {
            sendMessage('Wrong credentials',true,5000)
        }
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedBlogAppUser')
        setUser(null)
    }

    const sendMessage = (message, messageBad, time) => {
        setMessage(message)
        setMessageBad(messageBad)
        setTimeout(() => {
            setMessage(null)
            setMessageBad(false)
        }, time)
    }


    const addBlog = async (newObject) => {
        blogFormRef.current.toggleVisibility()
        const newBlog = { title: newObject.title, author: newObject.author, url: newObject.url }
        const response = await blogService.create(newBlog)
        setBlogs(blogs.concat(response))
        sendMessage(`A new blog ${response.title} by ${response.author} added.`,false,5000)
    }

    const updateBlog = async (updatedBlog) => {
        const response = await blogService.put(updatedBlog)
        setBlogs(blogs.map(blog => blog.id !== response.id ? blog : response))
    }

    const removeBlog = async (blogToRemove) => {
        const response = await blogService.deleteBlog(blogToRemove)
        console.log(response,'response')
        if (response.status === 204){
            setBlogs(blogs.filter(blog => blog.id !== blogToRemove.id))
            sendMessage(`The blog, '${blogToRemove.title}' by ${blogToRemove.author} has been removed.`, false, 5000)
        }
        else{
            sendMessage('Unauthorized delete', true, 5000)
        }

    }

    return (
        <div>
            <h1>Blogs-app</h1>
            <Notification message={message} messageBad={messageBad}/>
            {user === null ?
                <Toggleable buttonLabel="Login">
                    <LoginForm handleLogin={handleLogin}/>
                </Toggleable> :
                <div>
                    {user.name} logged-in <button onClick={() => handleLogout()}>Logout</button>
                    <br/>
                    <br/>
                    <Toggleable buttonLabel="Create blog" ref={blogFormRef}>
                        <BlogsForm addBlog={addBlog}/>
                    </Toggleable>
                    <h2>Blogs:</h2>
                    {blogs.sort((blogA,blogB) => blogB.likes - blogA.likes, ).map(blog =>
                        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={removeBlog} currentUserId={user.id}/>
                    )}

                </div>}

        </div>
    )
}

export default App