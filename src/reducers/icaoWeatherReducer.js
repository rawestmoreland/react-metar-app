import { GET_ICAO_WEATHER, WEATHER_LOADING } from '../actions/types'

const initialState = {
  weatherData: {},
  isLoading: true
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ICAO_WEATHER:
      return {
        ...state,
        weatherData: action.payload,
        isLoading: false
      }
    case WEATHER_LOADING:
      return {
        ...state,
        isLoading: true
      }
    default:
      return state
  }
}
