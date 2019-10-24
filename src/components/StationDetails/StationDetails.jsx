import React from 'react'
import './StationDetails.css'
import sun from './sun.svg'

const StationDetails = (props) => {

    const stationData = props.stationData
    const stationTimestamp = stationData ? props.stationTimestamp : ""
    const stationName = stationData ? stationData.name : ""
    const city = stationData ? stationData.city : ""
    const state = stationData ? stationData.state.name : ""
    const country = stationData ? stationData.country.name : ""
    const dawn = stationData ? stationTimestamp.sunrise_sunset.local.civil_dawn : ""
    const rise = stationData ? stationTimestamp.sunrise_sunset.local.sun_rise : ""
    const set = stationData ? stationTimestamp.sunrise_sunset.local.sun_set : ""
    const dusk = stationData ? stationTimestamp.sunrise_sunset.local.civil_dusk : ""

    const arrowUp = <i className="rotated-arrow-up fas fa-long-arrow-alt-up" />
    const arrowDown = <i className="rotated-arrow-down fas fa-long-arrow-alt-up" />
    let d = new Date()
    let timeHour = d.getHours()
    let timeMinute = d.getMinutes()
    let utcHour = d.getUTCHours()
    let utcMinute = d.getUTCMinutes()

    return (
        stationData ? 
        <div className='station-card-wrapper'>
            <div className="station-row">
                <p className="airport-name">{stationName}</p>
                <p className="local-timestamp">{`LT ${timeHour}:${timeMinute}`}</p>
            </div>
            <div className='station-row'>
                <p className="city-state">{`${city} | ${state} | ${country}`}</p>
                <p className="utc-timestamp">{`UTC ${utcHour}:${utcMinute}`}</p>
            </div>
            <div className="station-row">
                <div className="sunrise-sunset">
                    <div>{dawn}</div>
                    <div>{arrowUp}</div>
                    <div>{rise}</div>
                    <div className="sunrise-logo-wrapper"><img src={sun} alt="" className="sunrise-logo" /></div>
                    <div>{set}</div>
                    <div>{arrowDown}</div>
                    <div>{dusk}</div>
                </div>
            </div>
        </div>
        : <div className="errorWrapper">
            No airport data found.
        </div>
    )

}

export default StationDetails