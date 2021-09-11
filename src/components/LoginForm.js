import React, { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin }) => {
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')

    const loginSubmit = (event) => {
        event.preventDefault()
        handleLogin({ username,password })
        setUsername('')
        setPassword('')
    }

    return <div>
        <h2>Log in to application</h2>
        <form onSubmit={loginSubmit}>
            <div>
                Username: <input id="loginform-username" type="text" value={username} name="Username"
                    onChange={({ target }) => setUsername(target.value)}/>
            </div>
            <div>
                Password: <input id="loginfrom-password" type="text" value={password} name="Password"
                    onChange={({ target }) => setPassword(target.value)}/>
            </div>
            <button id="loginform-submit" type="submit">Login</button>
        </form>
    </div>
}

LoginForm.propTypes = {
    handleLogin: PropTypes.func.isRequired
}


export default LoginForm