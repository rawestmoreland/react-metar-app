import { GET_ICAO_STATION, WEATHER_LOADING } from '../actions/types'
import axios from 'axios'

export const getIcaoStation = icao => dispatch => {
  dispatch(setLoading())
  const api_key = process.env.REACT_APP_API_KEY
  const config = {
    headers: {
      'X-API-Key': api_key
    }
  }
  const url = `https://api.checkwx.com/station/${icao}`
  axios.get(url, config).then(res =>
    dispatch({
      type: GET_ICAO_STATION,
      payload: res.data.data[0]
    })
  )
}

export const setLoading = () => {
  return {
    type: WEATHER_LOADING
  }
}
