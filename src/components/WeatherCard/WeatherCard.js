import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './WeatherCard.css'

function WeatherCard() {
  const [metarData, setMetarData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        fetchLocal(position.coords.latitude, position.coords.longitude)
      })
    } else {
      console.log('ERROR. No location found')
    }
  }, [])

  const fetchLocal = async (lat, long) => {
    const data = await fetch(
      `https://api.checkwx.com/metar/lat/${lat}/lon/${long}/radius/50/decoded`,
      { headers: { 'X-API-Key': api_key } }
    )

    const jsonData = await data.json()

    console.log(jsonData)

    setMetarData(jsonData.data)

    setIsLoading(false)

    console.log(metarData)
  }

  const items = Object.keys(metarData).map(key => (
    <div
      key={key}
      className={`weather-card ${
        key == metarData.length - 1 ? 'weather-card-last' : ''
      }`}
    >
      <Link to={metarData[key].icao}>
        <div className='weather-row'>
          <p className='airport-name'>{metarData[key].station.name}</p>
          <p className='airport-code'>{metarData[key].icao}</p>
        </div>
        <div className='weather-row'>
          <div className='weather-row-left'>
            <p className='wind-speed-direction'>
              {`${
                metarData[key].wind != undefined
                  ? metarData[key].wind.degrees + 'º'
                  : 'calm'
              } ${
                metarData[key].wind != undefined
                  ? metarData[key].wind.speed_kts + 'kts'
                  : ''
              }`}
            </p>
            <p className='visibility'>
              {`${metarData[key].visibility.miles} miles`}
            </p>
            {metarData[key].clouds.map((item, index) => (
              <p key={index} className='sky-condition'>{`${item.code} ${
                item.base_feet_agl ? item.base_feet_agl : ''
              }`}</p>
            ))}
          </div>
          <div>
            <div className='weather-row-right'>
              <div className='temp-dewpoint'>
                <p className='temp'>{`${metarData[key].temperature.celsius}ºC`}</p>
                <p className='dewpoint'>{`${metarData[key].dewpoint.celsius}ºC ${metarData[key].humidity.percent}%`}</p>
                <p className='barometer'>{`${metarData[key].barometer.hg} inHg`}</p>
              </div>
              <div
                className={`flight-rules ${
                  metarData[key].flight_category === 'VFR'
                    ? 'flight-rules-vfr'
                    : metarData[key].flight_category === 'IFR'
                    ? 'flight-rules-ifr'
                    : metarData[key].flight_category === 'MVFR'
                    ? 'flight-rules-mvfr'
                    : metarData[key].flight_category === 'LIFR'
                    ? 'flight-rules-lifr'
                    : ''
                }`}
              >
                <div className='flight-rules-text'>
                  {metarData[key].flight_category}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  ))

  return (
    <div
      className={`${!isLoading ? 'weather-card-wrapper' : 'loading-wrapper'}`}
    >
      {!isLoading ? (
        items
      ) : (
        <div><i className='load-spinner fas fa-asterisk fa-spin fa-4x'></i></div>
      )}
    </div>
  )
}

export default WeatherCard
