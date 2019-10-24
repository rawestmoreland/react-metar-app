import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './WeatherCard.css'
import testData from './testData.json'

function WeatherCard() {

  // localStorage.clear()

  const [metarData, setMetarData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  let cachedData
  let cachedTime

  // Some static data saved externally
  let devData = testData

  // API key stored in env file
  const api_key = process.env.REACT_APP_API_KEY

  let now = new Date().getTime()

  // const api_key = 'fde2a3adbcfa5fe325d5fb52ee'

  useEffect(() => {
    if (localStorage.getItem('metarData')) {
      console.log('Data found locally. Checking the timestamp...')
      cachedData = localStorage.getItem('metarData')
      cachedTime = localStorage.getItem('cachedTime')
    } else {
      console.log('no local metar data found')
    }

    // If time since last cache is more than 15 minutes, clear the cachedData variable
    if (cachedData && now - cachedTime > 900000) {
      console.log('15 minutes has elapsed. Fetching new data from the API')
      cachedData = null
    }

    if (cachedData) {
      console.log('Using cached data')
      let jsonData = JSON.parse(cachedData)
      setMetarData(jsonData.data)
      setInterval(() => {
        setIsLoading(false)
      }, 2000)
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          fetchLocal(position.coords.latitude, position.coords.longitude)
        })
      } else {
        console.log('ERROR. No location found')
      }
    }
  }, []) // Empty array keeps the useEffect from looping

  const fetchLocal = async (lat, long) => {

    console.log("Fetching API data....")

    const data = await fetch(
      `https://api.checkwx.com/metar/lat/${lat}/lon/${long}/radius/50/decoded`,
      { headers: { 'X-API-Key': api_key } }
    )

    const jsonData = await data.json()

    console.log(jsonData.data)

    cachedTime = new Date().getTime()

    // Save the json to local storage for late
    localStorage.setItem('metarData', JSON.stringify(jsonData))
    // Time stamp the local storage save
    localStorage.setItem('cachedTime', cachedTime)

    setMetarData(jsonData.data)

    setInterval(() => {
      setIsLoading(false)
    }, 2000)
  }

  const items =
    metarData != null ? (
      Object.keys(metarData).map(key => (
        <div
          key={key}
          className={`weather-card ${
            key === metarData.length - 1 ? 'weather-card-last' : ''
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
                    metarData[key].wind !== undefined
                      ? metarData[key].wind.degrees + 'º'
                      : 'calm'
                  } ${
                    metarData[key].wind !== undefined
                      ? metarData[key].wind.speed_kts + 'kts'
                      : ''
                  } ${
                    metarData[key].wind === undefined
                      ? ''
                      : metarData[key].wind.gust_kts === undefined
                      ? ''
                      : metarData[key].wind.gust_kts
                  }`}
                </p>
                <p className='visibility'>
                  {`${metarData[key].visibility !== undefined ? metarData[key].visibility.miles + " miles" : ""}`}
                </p>
                {metarData[key].clouds.map((item, index) => (
                  <p key={index + 1} className='sky-condition'>{`${item.code} ${
                    item.base_feet_agl ? item.base_feet_agl : ''
                  }`}</p>
                ))}
              </div>
              <div>
                <div className='weather-row-right'>
                  <div className='temp-dewpoint'>
                    <p className='temp'>{`${metarData[key].temperature !== undefined ? metarData[key].temperature.celsius + "ºC" : ""}`}</p>
                    <p className='dewpoint'>{`${metarData[key].dewpoint !== undefined ? metarData[key].dewpoint.celsius + "ºC" : ""} ${metarData[key].humidity !== undefined ? metarData[key].humidity.percent + "%" : ""}`}</p>
                    <p className='barometer'>{`${metarData[key].barometer !== undefined ? metarData[key].barometer.hg + " inHg" : ""}`}</p>
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
    ) : (
      <div>Something happened</div>
    )

  return (
    <>
    {isLoading ? <i className='load-spinner fas fa-asterisk fa-spin fa-4x'></i> : <div></div>}
    <div
      className={`${!isLoading ? 'weather-card-wrapper' : 'loading-wrapper'}`}
    >
      {!isLoading ? items === undefined ? <div></div> : items : <div></div>}
    </div>
    </>
  )
}

export default WeatherCard
