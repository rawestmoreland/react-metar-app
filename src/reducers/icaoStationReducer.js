import { GET_ICAO_STATION, WEATHER_LOADING } from '../actions/types'

const initialState = {
  stationData: {},
  isLoading: true
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ICAO_STATION:
      return {
        stationData: action.payload,
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
