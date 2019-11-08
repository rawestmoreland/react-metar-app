import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import StationDetails from '../StationDetails/StationDetails'
import MetarCard from './MetarCard'
import TafCard from './TafCard'
import './WeatherDetails.css'

import { getIcaoWeather } from '../../actions/icaoWeatherActions'
import { getIcaoTaf } from '../../actions/icaoTafActions'
import { getIcaoStation } from '../../actions/icaoStationActions'
import { getStationTimestamp } from '../../actions/stationTimestampActions'

class WeatherDetails extends Component {
  // const [icao, setIcao] = useState(match.params.icao)
  // const [weatherData, setWeatherData] = useState(null)
  // const [tafData, setTafData] = useState(null)

  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     icao: props.match.params.icao
  //   }
  // }

  componentDidMount() {
    const icao = this.props.match.params.icao
    console.log('resetting the values for a new city')
    this.props.getIcaoWeather(icao)
    this.props.getIcaoTaf(icao)
    this.props.getIcaoStation(icao)
    this.props.getStationTimestamp(icao)
  }

  // const api_key = process.env.REACT_APP_API_KEY

  // const [stationDataLoading, setStationDataLoading] = useState(true)
  // const [stationTimestampLoading, setStationTimestampLoading] = useState(true)
  // const [stationData, setStationData] = useState(null)
  // const [stationTimestamp, setStationTimestamp] = useState(null)

  static propTypes = {
    getIcaoWeather: PropTypes.func.isRequired,
    getIcaoTaf: PropTypes.func.isRequired,
    getIcaoStation: PropTypes.func.isRequired,
    getStationTimestamp: PropTypes.func.isRequired,
    stationDataLoading: PropTypes.bool,
    stationTimestampLoading: PropTypes.bool,
    weatherData: PropTypes.object.isRequired,
    tafData: PropTypes.object,
    stationData: PropTypes.object,
    stationTimestamp: PropTypes.object
  }

  // useEffect(() => {
  //   console.log('resetting the values for a new city')
  //   getIcaoWeather(icao)
  //   fetchWeather(icao)
  //   fetchTaf(icao)
  //   fetchStation(icao)
  //   fetchStationTimestamp(icao)
  // }, [icao])

  // fetchWeather = async icao => {
  //   const data = await fetch(`https://api.checkwx.com/metar/${icao}/decoded`, {
  //     headers: { 'X-API-Key': api_key }
  //   })

  //   const jsonData = await data.json()

  //   setWeatherData(jsonData.data[0])

  //   console.log(weatherData)
  // }

  // fetchTaf = async icao => {
  //   const data = await fetch(`https://api.checkwx.com/taf/${icao}/decoded`, {
  //     headers: { 'X-API-Key': api_key }
  //   })

  //   const jsonData = await data.json()

  //   setTafData(jsonData.data[0])
  // }

  // fetchStation = async icao => {
  //   const data = await fetch(`https://api.checkwx.com/station/${icao}/`, {
  //     headers: { 'X-API-Key': api_key }
  //   })

  //   const jsonData = await data.json()

  //   setStationData(jsonData.data[0])

  //   setStationDataLoading(false)
  // }

  //  fetchStationTimestamp = async icao => {
  //     const data = await fetch(
  //       `https://api.checkwx.com/station/${icao}/timestamp`,
  //       { headers: { 'X-API-Key': api_key } }
  //     )

  //     const jsonData = await data.json()

  //     setStationTimestamp(jsonData.data[0])

  //     setStationTimestampLoading(false)
  //   }

  render() {
    const {
      stationDataLoading,
      stationTimestampLoading,
      weatherData,
      tafData
    } = this.props
    return (
      <div
        className={
          stationDataLoading && stationTimestampLoading
            ? 'loading-wrapper'
            : 'weather-details-wrapper'
        }
      >
        {!stationDataLoading && !stationTimestampLoading ? (
          <StationDetails
          /*stationData={stationData[0]}
            stationTimestamp={stationTimestamp[0]}
            icao={this.props.match.params.icao}*/
          />
        ) : (
          <div>
            <i className='load-spinner fas fa-asterisk fa-spin fa-3x'></i>
          </div>
        )}
        <div className='divider'></div>
        {!stationDataLoading && !stationTimestampLoading ? (
          weatherData ? (
            <MetarCard /*data={weatherData[0]}*/ />
          ) : (
            <div></div>
          )
        ) : (
          <div></div>
        )}
        {!stationDataLoading && !stationTimestampLoading ? (
          tafData ? (
            <TafCard /*data={tafData[0]}*/ />
          ) : (
            <div></div>
          )
        ) : (
          <div></div>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  weatherData: state.icaoWeather.weatherData,
  tafData: state.icaoTaf.tafData,
  stationTimestamp: state.stationTimestamp.stationTimestamp,
  stationData: state.icaoStation.stationData,
  stationDataLoading: state.icaoStation.isLoading,
  stationTimestampLoading: state.stationTimestamp.isLoading
})

export default connect(
  mapStateToProps,
  { getIcaoWeather, getIcaoTaf, getIcaoStation, getStationTimestamp }
)(WeatherDetails)
