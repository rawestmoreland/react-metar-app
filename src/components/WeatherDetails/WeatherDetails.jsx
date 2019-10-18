import React, { useEffect, useState } from 'react'
import StationDetails from '../StationDetails/StationDetails'
import MetarCard from './MetarCard'
import TafCard from './TafCard'
import './WeatherDetails.css'

const WeatherDetails = ({ match }) => {

    const icao = match.params.icao
    const [weatherData, setWeatherData] = useState(null)
    const [tafData, setTafData] = useState(null)

    const api_key = process.env.REACT_APP_API_KEY

    const [stationDataLoading, setStationDataLoading] = useState(true)
    const [stationTimestampLoading, setStationTimestampLoading] = useState(true)
    const [stationData, setStationData] = useState(null)
    const [stationTimestamp, setStationTimestamp] = useState(null)

    useEffect(() => {
        fetchWeather(icao)
        fetchTaf(icao)
        fetchStation(icao)
        fetchStationTimestamp(icao)
    }, [])

    const fetchWeather = async (icao) => {
        const data = await fetch(`https://api.checkwx.com/metar/${icao}/decoded`,
            { headers: { 'X-API-Key': api_key } })

        const jsonData = await data.json()

        setWeatherData(jsonData.data[0])
    }

    const fetchTaf = async (icao) => {
        const data = await fetch(`https://api.checkwx.com/taf/${icao}/decoded`,
            { headers: { 'X-API-Key': api_key } })

        const jsonData = await data.json()

        setTafData(jsonData.data[0])
    }

    const fetchStation = async (icao) => {
        const data = await fetch(`https://api.checkwx.com/station/${icao}/`,
            { headers: { 'X-API-Key': api_key } })

        const jsonData = await data.json()

        setStationData(jsonData.data[0])

        setStationDataLoading(false)
    }

    const fetchStationTimestamp = async (icao) => {
        const data = await fetch(`https://api.checkwx.com/station/${icao}/timestamp`,
            { headers: { 'X-API-Key': api_key } })

        const jsonData = await data.json();

        setStationTimestamp(jsonData.data[0])

        setStationTimestampLoading(false)
    }

    return (
        <div className={(stationDataLoading && stationTimestampLoading) ? 'loading-wrapper' : 'weather-details-wrapper'}>
            {(!stationDataLoading && !stationTimestampLoading)
                ? <StationDetails stationData={stationData} stationTimestamp={stationTimestamp} icao={icao} />
                : <div><i className="load-spinner fas fa-asterisk fa-spin fa-3x"></i></div>}
            <div className='divider'></div>
            {(!stationDataLoading && !stationTimestampLoading)
                ? weatherData ? <MetarCard data={weatherData} /> : <div></div>
                : <div></div>}
            {(!stationDataLoading && !stationTimestampLoading)
                ?  tafData ? <TafCard data={tafData} /> : <div></div>
                : <div></div>}
        </div>
    )
}

export default WeatherDetails