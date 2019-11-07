import React from 'react'

const WeatherRow = props => (
  <>
    <div className='title-col'>
      <p>{props.title}</p>
    </div>
    <div className='data-col'>
      <p>{props.data}</p>
    </div>
  </>
)

export default WeatherRow
