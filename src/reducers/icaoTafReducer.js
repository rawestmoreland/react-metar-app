import { GET_ICAO_TAF, WEATHER_LOADING } from '../actions/types'

const initialState = {
  tafData: null,
  isLoading: true
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ICAO_TAF:
      return {
        ...state,
        tafData: action.payload,
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
