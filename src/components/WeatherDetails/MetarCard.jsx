import React from 'react'
import './WeatherDetails.css'

const MetarCard = (props) => {

    const data = props.data;

    return (
        <div className="metar-card-wrapper">
            <div className="metar-row">
                <p>METAR</p>
                <p>{data.icao}</p>
            </div>
        </div>
    )
}

export default MetarCard