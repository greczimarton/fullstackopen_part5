import React from 'react'

const Notification = ({ message, messageBad }) => {
    if (message === null) {
        return null
    }

    if (messageBad){
        return (
            <div className="error">
                {message}
            </div>
        )
    }
    else{
        return (
            <div className="ok">
                {message}
            </div>
        )
    }

}

export default Notification