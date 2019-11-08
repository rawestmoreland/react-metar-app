import { combineReducers } from 'redux'
import allWeatherReducer from '../reducers/allWeatherReducer'
import icaoWeatherReducer from '../reducers/icaoWeatherReducer'
import icaoStationReducer from './icaoStationReducer'
import stationTimestampReducer from './stationTimestampReducer'
import icaoTafReducer from './icaoTafReducer'

export default combineReducers({
  allWeather: allWeatherReducer,
  icaoWeather: icaoWeatherReducer,
  icaoTaf: icaoTafReducer,
  icaoStation: icaoStationReducer,
  stationTimestamp: stationTimestampReducer
})
