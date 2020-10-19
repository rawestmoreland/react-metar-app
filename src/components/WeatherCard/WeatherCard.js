import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getAllWeather } from '../../actions/allWeatherActions'
import axios from 'axios'
import './WeatherCard.css'
import PropTypes from 'prop-types'

class WeatherCard extends Component {
  componentDidMount() {
    this.props.getAllWeather()
  }

  static propTypes = {
    getAllWeather: PropTypes.func.isRequired,
    metarData: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired
  }

  fetchLocal = async (lat, long) => {
    // API key stored in env file
    const api_key = process.env.REACT_APP_API_KEY
    const config = {
      headers: { 'X-API-Key': api_key }
	}
	console.log(api_key);
    const url = `https://api.checkwx.com/metar/lat/${lat}/lon/${long}/radius/50/decoded`
    console.log('Fetching API data....');

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
    const { metarData, isLoading } = this.props
    const items =
      metarData !== null ? (
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
                    {`${
                      metarData[key].visibility !== undefined
                        ? metarData[key].visibility.miles + ' miles'
                        : ''
                    }`}
                  </p>
                  {metarData[key].clouds.map((item, index) => (
                    <p key={index + 1} className='sky-condition'>{`${
                      item.code
                    } ${item.base_feet_agl ? item.base_feet_agl : ''}`}</p>
                  ))}
                </div>
                <div>
                  <div className='weather-row-right'>
                    <div className='temp-dewpoint'>
                      <p className='temp'>{`${
                        metarData[key].temperature !== undefined
                          ? metarData[key].temperature.celsius + 'ºC'
                          : ''
                      }`}</p>
                      <p className='dewpoint'>{`${
                        metarData[key].dewpoint !== undefined
                          ? metarData[key].dewpoint.celsius + 'ºC'
                          : ''
                      } ${
                        metarData[key].humidity !== undefined
                          ? metarData[key].humidity.percent + '%'
                          : ''
                      }`}</p>
                      <p className='barometer'>{`${
                        metarData[key].barometer !== undefined
                          ? metarData[key].barometer.hg + ' inHg'
                          : ''
                      }`}</p>
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
        {isLoading ? (
          <i className='load-spinner fas fa-asterisk fa-spin fa-4x'></i>
        ) : (
          <div></div>
        )}
        <div
          className={`${
            !isLoading ? 'weather-card-wrapper' : 'loading-wrapper'
          }`}
        >
          {!isLoading ? items === undefined ? <div></div> : items : <div></div>}
        </div>
      </>
    )
  }
}

const mapStateToProps = state => ({
  metarData: state.allWeather.metarData,
  isLoading: state.allWeather.isLoading
})

export default connect(
  mapStateToProps,
  { getAllWeather }
)(WeatherCard)
