import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import './Form.css'

const Form = props => {
  const history = useHistory()

  const [searchData, setSearchData] = useState('')

  const handleSubmit = e => {
    history.push(`/${searchData}`)
  }

  const handleChange = e => {
    e.preventDefault()
    setSearchData(e.target.value)
  }

  return (
    <div className='form-wrapper'>
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          type='text'
          placeholder='KIAH, KLAX, KORD'
          value={searchData}
        ></input>
        <button className='search-button' onClick={handleSubmit}>
          go
        </button>
      </form>
    </div>
  )
}

export default Form
