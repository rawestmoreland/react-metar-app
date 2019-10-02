import React, { useEffect, useState } from 'react'
import StationDetails from '../StationDetails/StationDetails'
import MetarCard from './MetarCard'
import './WeatherDetails.css'

const WeatherDetails = ({ match }) => {

    const icao = match.params.icao
    const [weatherData, setWeatherData] = useState([])

    const api_key = process.env.REACT_APP_API_KEY

    const [stationDataLoading, setStationDataLoading] = useState(true)
    const [stationTimestampLoading, setStationTimestampLoading] = useState(true)
    const [stationData, setStationData] = useState([])
    const [stationTimestamp, setStationTimestamp] = useState([])

    useEffect(() => {
        fetchWeather(icao)
        fetchStation(icao)
        fetchStationTimestamp(icao)
    }, [])

    const fetchWeather = async (icao) => {
        const data = await fetch(`https://api.checkwx.com/metar/${icao}/decoded`,
            { headers: { 'X-API-Key': api_key } })

        const jsonData = await data.json();

        console.log(jsonData.data[0]);

        setWeatherData(jsonData.data[0])
    }

    const fetchStation = async (icao) => {
        const data = await fetch(`https://api.checkwx.com/station/${icao}/`,
            { headers: { 'X-API-Key': api_key } })

        const jsonData = await data.json()

        setStationData(jsonData.data[0])

        setStationDataLoading(false)

        console.log(jsonData)
    }

    const fetchStationTimestamp = async (icao) => {
        const data = await fetch(`https://api.checkwx.com/station/${icao}/timestamp`,
            { headers: { 'X-API-Key': api_key } })

        const jsonData = await data.json();

        setStationTimestamp(jsonData.data[0])

        setStationTimestampLoading(false)

        console.log(jsonData.data[0])
    }

    console.log(match)

    return (
        <div className={(stationDataLoading && stationTimestampLoading) ? 'loading-wrapper' : 'weather-details-wrapper'}>
            {(!stationDataLoading && !stationTimestampLoading)
                ? <StationDetails stationData={stationData} stationTimestamp={stationTimestamp} icao={icao} />
                : <div><i className="load-spinner fas fa-asterisk fa-spin fa-3x"></i></div>}
            <div className='divider'></div>
            {(!stationDataLoading && !stationTimestampLoading)
            ? <MetarCard data={weatherData} />
            : null}
        </div>
    )
}

export default WeatherDetails