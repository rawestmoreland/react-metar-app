import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './WeatherDetails.css'
import WeatherRow from './weatherRow'

class MetarCard extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render() {
    let { data } = this.props
    if (data) {
      let obs = new Date(data.observed)
      return (
        <div className='metar-card-wrapper'>
          <div className='metar-row'>
            <div className='text-and-time'>
              <p className='metar'>METAR</p>
              <p className='metar-time'>{`${obs.getMonth() +
                1}/${obs.getDate()}/${obs.getFullYear()}, ${
                obs.getHours() > 12 ? obs.getHours() - 12 : obs.getHours()
              }:${(obs.getMinutes() < 10 ? '0' : '') + obs.getMinutes()} ${
                obs.getHours() < 12 ? 'AM' : 'PM'
              } LT`}</p>
            </div>
            <p className='icao'>{data.icao}</p>
          </div>
          <div className='weather-data'>
            <WeatherRow
              title={'Wind'}
              data={`${
                data.wind === undefined
                  ? 'calm'
                  : data.wind.degrees + 'º at ' + data.wind.speed_kts + 'kts'
              }`}
            />
            <div className='title-col'>
              <p>Visibility</p>
            </div>
            <div className='data-col'>
              <p>{`${
                data.visibility !== undefined
                  ? data.visibility.miles_float
                  : 'clear'
              }`}</p>
            </div>
            <div className='title-col'>
              <p>Weather</p>
            </div>
            <div className='data-col'>
              {data.conditions !== undefined
                ? data.conditions.map((i, index) => {
                    return <p key={index}>{i.text}</p>
                  })
                : ''}
            </div>
            <div className='title-col'>
              <p>Clouds</p>
            </div>
            <div className='data-col'>
              {data.clouds !== undefined
                ? data.clouds.map((i, index) => {
                    return (
                      <p key={index}>{`${i.code} ${
                        i.base_feet_agl !== undefined ? 'at' : ''
                      } ${
                        i.base_feet_agl !== undefined ? i.base_feet_agl : ''
                      }`}</p>
                    )
                  })
                : 'No significant clouds'}
            </div>
            <div className='title-col'>
              <p>Temperature</p>
            </div>
            <div className='data-col'>
              {data.temperature !== undefined ? (
                <p>{`${data.temperature.celsius}º C`}</p>
              ) : (
                ''
              )}
            </div>
            <div className='title-col'>
              <p>Dewpoint</p>
            </div>
            <div className='data-col'>
              {data.dewpoint !== undefined ? (
                <p>{`${data.dewpoint.celsius}º C`}</p>
              ) : (
                ''
              )}
            </div>
            <div className='title-col'>
              <p>Pressure</p>
            </div>
            <div className='data-col'>
              {data.barometer !== undefined ? (
                <p>{`${data.barometer.hg}`}</p>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      )
    } else {
      return <div />
    }
  }
}

const mapStateToProps = state => ({
  data: state.icaoWeather.weatherData
})

export default connect(mapStateToProps)(MetarCard)
