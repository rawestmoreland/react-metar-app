import { combineReducers } from 'redux'

export default combineReducers({
  allWeather: allWeatherReducer,
  icaoWeather: icaoWeatherReducer,
  icaoTaf: icaoTafReducer,
  icaoStation: icaoStationReducer
})
