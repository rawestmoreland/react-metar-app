import { GET_ALL_WEATHER, WEATHER_LOADING } from '../actions/types'

const initialState = {
  metarData: [],
  isLoading: true
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_WEATHER:
      return {
        metarData: action.payload,
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
