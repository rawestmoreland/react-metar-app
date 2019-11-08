import { GET_STATION_TIMESTAMP, WEATHER_LOADING } from './types'
import axios from 'axios'

export const getStationTimestamp = icao => dispatch => {
  dispatch(setLoading())
  const api_key = process.env.REACT_APP_API_KEY
  const config = {
    headers: {
      'X-API-Key': api_key
    }
  }
  const url = `https://api.checkwx.com/station/${icao}/timestamp`
  axios.get(url, config).then(res =>
    dispatch({
      type: GET_STATION_TIMESTAMP,
      payload: res.data.data[0]
    })
  )
}

export const setLoading = () => {
  return {
    type: WEATHER_LOADING
  }
}
