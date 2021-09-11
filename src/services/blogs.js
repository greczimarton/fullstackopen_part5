import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const create = async (blog) => {
    const config = {
        headers: { Authorization: token }
    }
    console.log('tokenOnCreating', token)
    const response = await axios.post(baseUrl, blog,config)
    return response.data
}

const put = async (blog) => {
    const response = await axios.put(`${baseUrl}/${blog.id}`,blog)
    return response.data
}

const deleteBlog = async (blog) => {
    const config = {
        headers: { Authorization: token }
    }
    console.log('tokenOnDeleting',token)
    console.log('bloginBlogs.js',blog)
    try {
        const response = await axios.delete(`${baseUrl}/${blog.id}`,config)
        return response
    }
    catch (exception) {
        return { status: 400 }
    }
}

export default { getAll, create, setToken, put, deleteBlog }