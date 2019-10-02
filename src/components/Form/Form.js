import React from 'react'
import './Form.css'

const Form = (props) => {

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div className="form-wrapper">
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="KIAH, KLAX, KORD"></input>
                <button type="submit">go</button>
            </form>
        </div>

    )
}

export default Form