import axios from 'axios'
import { GET_ALL_WEATHER, WEATHER_LOADING } from './types'
// import testData from '../components/WeatherCard/testData.json'

export const getAllWeather = () => dispatch => {
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
    dispatch(setLoading())
    dispatch({
      type: GET_ALL_WEATHER,
      payload: jsonData
    })
  } else {
    dispatch(setLoading())

    // Use test data
    // dispatch({
    //   type: GET_ALL_WEATHER,
    //   payload: testData.data
    // })

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude
        const long = position.coords.longitude
        // API key stored in env file
        const api_key = process.env.REACT_APP_API_KEY
        const config = {
          headers: { 'X-API-Key': api_key }
        }
        const url = `https://api.checkwx.com/metar/lat/${lat}/lon/${long}/radius/50/decoded`
        axios.get(url, config).then(res => {
          const cachedTime = new Date().getTime()
          const jsonData = res.data.data
          localStorage.setItem('metarData', JSON.stringify(jsonData))
          localStorage.setItem('cachedTime', cachedTime)
          dispatch({
            type: GET_ALL_WEATHER,
            payload: res.data.data
          })
        })
      })
    } else {
      console.log('ERROR. No location found')
    }
  }
}

export const setLoading = () => {
  return {
    type: WEATHER_LOADING
  }
}
