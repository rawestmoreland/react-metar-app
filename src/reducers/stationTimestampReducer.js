import { GET_STATION_TIMESTAMP, WEATHER_LOADING } from '../actions/types'

const initialState = {
  stationTimestamp: {},
  isLoading: true
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_STATION_TIMESTAMP:
      return {
        stationTimestamp: action.payload,
        isLoading: false
      }
    case WEATHER_LOADING:
      return {
        isLoading: true
      }
    default:
      return state
  }
}
