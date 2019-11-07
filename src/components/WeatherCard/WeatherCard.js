import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './WeatherCard.css'
import testData from './testData.json'

class WeatherCard extends Component {
  // const [metarData, setMetarData] = useState([])
  // const [isLoading, setIsLoading] = useState(true)

  state = {
    metarData: [],
    isLoading: true
  }

  componentDidMount() {
    // localStorage.clear()
    let cachedData
    let cachedTime
    let now = new Date().getTime()
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
      this.setState({
        metarData: jsonData.data
      })
      setInterval(() => {
        this.setState({
          isLoading: false
        })
      }, 2000)
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.fetchLocal(position.coords.latitude, position.coords.longitude)
        })
      } else {
        console.log('ERROR. No location found')
      }
    }
  }

  // let cachedData
  // let cachedTime

  // Some static data saved externally
  // let devData = testData

  // let now = new Date().getTime()

  // useEffect(() => {
  //   if (localStorage.getItem('metarData')) {
  //     console.log('Data found locally. Checking the timestamp...')
  //     cachedData = localStorage.getItem('metarData')
  //     cachedTime = localStorage.getItem('cachedTime')
  //   } else {
  //     console.log('no local metar data found')
  //   }

  //   // If time since last cache is more than 15 minutes, clear the cachedData variable
  //   if (cachedData && now - cachedTime > 900000) {
  //     console.log('15 minutes has elapsed. Fetching new data from the API')
  //     cachedData = null
  //   }

  //   if (cachedData) {
  //     console.log('Using cached data')
  //     let jsonData = JSON.parse(cachedData)
  //     setMetarData(jsonData.data)
  //     setInterval(() => {
  //       setIsLoading(false)
  //     }, 2000)
  //   } else {
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(position => {
  //         fetchLocal(position.coords.latitude, position.coords.longitude)
  //       })
  //     } else {
  //       console.log('ERROR. No location found')
  //     }
  //   }
  // }, []) // Empty array keeps the useEffect from looping

  fetchLocal = async (lat, long) => {
    // API key stored in env file
    const api_key = process.env.REACT_APP_API_KEY
    const config = {
      headers: { 'X-API-Key': api_key }
    }
    const url = `https://api.checkwx.com/metar/lat/${lat}/lon/${long}/radius/50/decoded`
    console.log('Fetching API data....')

    // Fetch the data from the API
    const data = await axios.get(url, config)

    const jsonData = data.data

    console.log(data.data)

    // Get the current time
    const cachedTime = new Date().getTime()

    // Save the json to local storage for later
    localStorage.setItem('metarData', JSON.stringify(jsonData))
    // Time stamp the local storage save
    localStorage.setItem('cachedTime', cachedTime)

    // Put the data in the metar state
    this.setState({
      metarData: jsonData.data
    })

    // Update the loading state to stop the spinner
    setInterval(() => {
      this.setState({
        isLoading: false
      })
    }, 2000)
  }

  render() {
    let items =
      this.state.metarData != null ? (
        Object.keys(this.state.metarData).map(key => (
          <div
            key={key}
            className={`weather-card ${
              key === this.state.metarData.length - 1 ? 'weather-card-last' : ''
            }`}
          >
            <Link to={this.state.metarData[key].icao}>
              <div className='weather-row'>
                <p className='airport-name'>
                  {this.state.metarData[key].station.name}
                </p>
                <p className='airport-code'>{this.state.metarData[key].icao}</p>
              </div>
              <div className='weather-row'>
                <div className='weather-row-left'>
                  <p className='wind-speed-direction'>
                    {`${
                      this.state.metarData[key].wind !== undefined
                        ? this.state.metarData[key].wind.degrees + 'º'
                        : 'calm'
                    } ${
                      this.state.metarData[key].wind !== undefined
                        ? this.state.metarData[key].wind.speed_kts + 'kts'
                        : ''
                    } ${
                      this.state.metarData[key].wind === undefined
                        ? ''
                        : this.state.metarData[key].wind.gust_kts === undefined
                        ? ''
                        : this.state.metarData[key].wind.gust_kts
                    }`}
                  </p>
                  <p className='visibility'>
                    {`${
                      this.state.metarData[key].visibility !== undefined
                        ? this.state.metarData[key].visibility.miles + ' miles'
                        : ''
                    }`}
                  </p>
                  {this.state.metarData[key].clouds.map((item, index) => (
                    <p key={index + 1} className='sky-condition'>{`${
                      item.code
                    } ${item.base_feet_agl ? item.base_feet_agl : ''}`}</p>
                  ))}
                </div>
                <div>
                  <div className='weather-row-right'>
                    <div className='temp-dewpoint'>
                      <p className='temp'>{`${
                        this.state.metarData[key].temperature !== undefined
                          ? this.state.metarData[key].temperature.celsius + 'ºC'
                          : ''
                      }`}</p>
                      <p className='dewpoint'>{`${
                        this.state.metarData[key].dewpoint !== undefined
                          ? this.state.metarData[key].dewpoint.celsius + 'ºC'
                          : ''
                      } ${
                        this.state.metarData[key].humidity !== undefined
                          ? this.state.metarData[key].humidity.percent + '%'
                          : ''
                      }`}</p>
                      <p className='barometer'>{`${
                        this.state.metarData[key].barometer !== undefined
                          ? this.state.metarData[key].barometer.hg + ' inHg'
                          : ''
                      }`}</p>
                    </div>
                    <div
                      className={`flight-rules ${
                        this.state.metarData[key].flight_category === 'VFR'
                          ? 'flight-rules-vfr'
                          : this.state.metarData[key].flight_category === 'IFR'
                          ? 'flight-rules-ifr'
                          : this.state.metarData[key].flight_category === 'MVFR'
                          ? 'flight-rules-mvfr'
                          : this.state.metarData[key].flight_category === 'LIFR'
                          ? 'flight-rules-lifr'
                          : ''
                      }`}
                    >
                      <div className='flight-rules-text'>
                        {this.state.metarData[key].flight_category}
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
        {this.state.isLoading ? (
          <i className='load-spinner fas fa-asterisk fa-spin fa-4x'></i>
        ) : (
          <div></div>
        )}
        <div
          className={`${
            !this.state.isLoading ? 'weather-card-wrapper' : 'loading-wrapper'
          }`}
        >
          {!this.state.isLoading ? (
            items === undefined ? (
              <div></div>
            ) : (
              items
            )
          ) : (
            <div></div>
          )}
        </div>
      </>
    )
  }
}

export default WeatherCard
