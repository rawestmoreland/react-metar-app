import React, { useEffect, useState, Component } from 'react'

class TafCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null
    }
  }

  componentDidMount() {
    this.setState({
      data: this.props.data
    })
  }

  render() {
    let data = this.state.data
    if (data) {
      const obs = new Date(data.timestamp.issued)
      console.log(data)
      const from = new Date(data.timestamp.from)
      const to = new Date(data.timestamp.to)
      return (
        <div className='taf-card-wrapper'>
          <div className='metar-row'>
            <div className='text-and-time'>
              <p className='metar'>TAF</p>
              <p className='metar-time'>
                {`${obs.getMonth() +
                  1}/${obs.getDate()}/${obs.getFullYear()}, ${
                  obs.getHours() > 12 ? obs.getHours() - 12 : obs.getHours()
                }:${(obs.getMinutes() < 10 ? '0' : '') + obs.getMinutes()} ${
                  from.getHours() > 12 ? 'PM' : 'AM'
                } LT`}
              </p>
            </div>
          </div>
          <div className='forecast-wrapper'>
            <p className='forecast-title'>
              {`Forecast from ${
                from.getHours() > 12 ? from.getHours() - 12 : from.getHours()
              }:${(from.getMinutes() < 10 ? '0' : '') + from.getMinutes()} ${
                from.getHours() > 12 ? 'PM' : 'AM'
              } LT (${from.getDate()}.) to ${
                to.getHours() > 12 ? to.getHours() - 12 : to.getHours()
              }:${(to.getMinutes() < 10 ? '0' : '') + to.getMinutes()} ${
                from.getHours() > 12 ? 'PM' : 'AM'
              } LT (${to.getDate()}.)`}
            </p>
            <div className='forecast-data'>
              <p>{`${data.forecast[0].wind.degrees}º at ${data.forecast[0].wind.speed_kts} knots`}</p>
              {data.forecast[0].wind.gust_kts !== undefined ? (
                <p>{`Gusting to ${data.forecast[0].wind.gust_kts} knots`}</p>
              ) : null}
              <p>{`${data.forecast[0].visibility.miles} miles`}</p>
              {data.forecast[0].conditions !== undefined
                ? data.forecast[0].conditions.map((i, index) => {
                    return <p key={index}>{`${i.text}`}</p>
                  })
                : null}
              {data.forecast[0].clouds !== undefined
                ? data.forecast[0].clouds.map((i, index) => {
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
            {data.forecast.slice(1).map((i, index) => {
              let from = new Date(i.timestamp.from)
              return (
                <div key={index}>
                  <p className='forecast-title'>
                    {`${i.change.indicator.text} ${
                      from.getHours() > 12
                        ? from.getHours() - 12
                        : from.getHours()
                    }:${(from.getMinutes() < 10 ? '0' : '') +
                      from.getMinutes()} ${
                      from.getHours() > 12 ? 'PM' : 'AM'
                    } LT (${from.getDate()}.):`}
                  </p>
                  <div className='forecast-data'>
                    <p>{`${i.wind.degrees} at ${i.wind.speed_kts} knots`}</p>
                    {i.wind.gust_kts !== undefined ? (
                      <p>{`Gusting ${i.wind.gust_kts} knots`}</p>
                    ) : null}
                    <p>{`${i.visibility.miles} miles`}</p>
                    {i.conditions !== undefined
                      ? i.conditions.map((i, index) => {
                          return <p key={index}>{`${i.text}`}</p>
                        })
                      : null}
                    {i.clouds !== undefined
                      ? i.clouds.map((i, index) => {
                          return (
                            <p key={index}>{`${i.code} ${
                              i.base_feet_agl !== undefined ? 'at' : ''
                            } ${
                              i.base_feet_agl !== undefined
                                ? i.base_feet_agl
                                : ''
                            }`}</p>
                          )
                        })
                      : 'No significant clouds'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    } else {
      return <div />
    }
  }
}

export default TafCard
