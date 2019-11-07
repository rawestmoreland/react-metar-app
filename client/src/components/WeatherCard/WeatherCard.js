import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './WeatherCard.css'

class WeatherCard extends Component {
  // localStorage.clear()

  constructor(props) {
    super(props)
    this.state = {
      metarData: [],
      isLoading: true
    }
  }

  // Fetch the METAR data from airports within 50 miles
  fetchLocal = (lat, long) => {
    console.log('Fetching API data....')

    const jsonData = null

    const data = fetch(
      `https://api.checkwx.com/metar/lat/${lat}/lon/${long}/radius/50/decoded`,
      { headers: { 'X-API-Key': this.api_key } }
    ).then(data => {
      jsonData = data.json()
    })

    console.log(jsonData.data)

    this.cachedTime = new Date().getTime()

    // Save the json to local storage for later
    localStorage.setItem('metarData', JSON.stringify(jsonData))
    // Time stamp the local storage save
    localStorage.setItem('cachedTime', this.cachedTime)

    //setMetarData(jsonData.data)
    this.setState({
      metarData: jsonData.data
    })

    setInterval(() => {
      this.setState({
        isLoading: false
      })
    }, 2000)
  }

  componentDidMount() {
    this.cachedData = null
    this.cachedTime = null
    this.api_key = process.env.REACT_APP_API_KEY
    this.now = new Date().getTime()
    // Check for cached data in localstorage
    if (localStorage.getItem('metarData')) {
      console.log('Data found locally. Checking the timestamp...')
      this.cachedData = localStorage.getItem('metarData')
      this.cachedTime = localStorage.getItem('cachedTime')
    } else {
      console.log('no local metar data found')
    }

    // If time since last cache is more than 15 minutes, clear the cachedData variable
    if (this.cachedData && this.now - this.cachedTime > 900000) {
      console.log('15 minutes has elapsed. Fetching new data from the API')
      this.cachedData = null
    }

    // If there is cached data - use the cached data
    if (this.cachedData) {
      console.log('Using cached data')
      let jsonData = JSON.parse(this.cachedData)
      this.setState({
        metarData: jsonData
      })
      setInterval(() => {
        this.setState({
          isLoading: false
        })
      }, 2000)
    } else {
      // If there is no cached data, fetch from the API
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.fetchLocal(position.coords.latitude, position.coords.longitude)
        })
      } else {
        console.log('ERROR. No location found')
      }
    }
  }

  items =
    this.metarData != null ? (
      Object.keys(this.metarData).map(key => (
        <div
          key={key}
          className={`weather-card ${
            key === this.metarData.length - 1 ? 'weather-card-last' : ''
          }`}
        >
          <Link to={this.metarData[key].icao}>
            <div className='weather-row'>
              <p className='airport-name'>{this.metarData[key].station.name}</p>
              <p className='airport-code'>{this.metarData[key].icao}</p>
            </div>
            <div className='weather-row'>
              <div className='weather-row-left'>
                <p className='wind-speed-direction'>
                  {`${
                    this.metarData[key].wind !== undefined
                      ? this.metarData[key].wind.degrees + 'º'
                      : 'calm'
                  } ${
                    this.metarData[key].wind !== undefined
                      ? this.metarData[key].wind.speed_kts + 'kts'
                      : ''
                  } ${
                    this.metarData[key].wind === undefined
                      ? ''
                      : this.metarData[key].wind.gust_kts === undefined
                      ? ''
                      : this.metarData[key].wind.gust_kts
                  }`}
                </p>
                <p className='visibility'>
                  {`${
                    this.metarData[key].visibility !== undefined
                      ? this.metarData[key].visibility.miles + ' miles'
                      : ''
                  }`}
                </p>
                {this.metarData[key].clouds.map((item, index) => (
                  <p key={index + 1} className='sky-condition'>{`${item.code} ${
                    item.base_feet_agl ? item.base_feet_agl : ''
                  }`}</p>
                ))}
              </div>
              <div>
                <div className='weather-row-right'>
                  <div className='temp-dewpoint'>
                    <p className='temp'>{`${
                      this.metarData[key].temperature !== undefined
                        ? this.metarData[key].temperature.celsius + 'ºC'
                        : ''
                    }`}</p>
                    <p className='dewpoint'>{`${
                      this.metarData[key].dewpoint !== undefined
                        ? this.metarData[key].dewpoint.celsius + 'ºC'
                        : ''
                    } ${
                      this.metarData[key].humidity !== undefined
                        ? this.metarData[key].humidity.percent + '%'
                        : ''
                    }`}</p>
                    <p className='barometer'>{`${
                      this.metarData[key].barometer !== undefined
                        ? this.metarData[key].barometer.hg + ' inHg'
                        : ''
                    }`}</p>
                  </div>
                  <div
                    className={`flight-rules ${
                      this.metarData[key].flight_category === 'VFR'
                        ? 'flight-rules-vfr'
                        : this.metarData[key].flight_category === 'IFR'
                        ? 'flight-rules-ifr'
                        : this.metarData[key].flight_category === 'MVFR'
                        ? 'flight-rules-mvfr'
                        : this.metarData[key].flight_category === 'LIFR'
                        ? 'flight-rules-lifr'
                        : ''
                    }`}
                  >
                    <div className='flight-rules-text'>
                      {this.metarData[key].flight_category}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))
    ) : (
      <div>Something happened</div>
    )

  render() {
    const isLoading = this.state.isLoading
    return (
      <div>
        {isLoading ? (
          <i className='load-spinner fas fa-asterisk fa-spin fa-4x'></i>
        ) : (
          <div></div>
        )}
        <div
          className={`${
            !isLoading ? 'weather-card-wrapper' : 'loading-wrapper'
          }`}
        >
          {!isLoading ? (
            this.items === undefined ? (
              <div></div>
            ) : (
              this.items
            )
          ) : (
            <div></div>
          )}
        </div>
      </div>
    )
  }

  // const [metarData, setMetarData] = useState([])
  // const [isLoading, setIsLoading] = useState(true)

  // let cachedData
  // let cachedTime

  // Some static data saved externally
  // let devData = testData

  // API key stored in env file
  // const api_key = process.env.REACT_APP_API_KEY

  // let now = new Date().getTime()

  // useEffect(() => {
  //   // Check for cached data in localstorage
  //   if (localStorage.getItem('metarData')) {
  //     console.log('Data found locally. Checking the timestamp...')
  //     cachedData = localStorage.getItem('metarData')
  //     cachedTime = localStorage.getItem('cachedTime')
  //   } else {
  //     console.log('no local metar data found')
  //   }

  //   // If time since last cache is more than 15 minutes, clear the cachedData variable
  //   if (cachedData && now - cachedTime > 900000) {
  //     console.log('15 minutes has elapsed. Fetching new data from the API')
  //     cachedData = null
  //   }

  //   // If there is cached data - use the cached data
  //   if (cachedData) {
  //     console.log('Using cached data')
  //     let jsonData = JSON.parse(cachedData)
  //     setMetarData(jsonData.data)
  //     setInterval(() => {
  //       setIsLoading(false)
  //     }, 2000)
  //   } else {
  //     // If there is no cached data, fetch from the API
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(position => {
  //         fetchLocal(position.coords.latitude, position.coords.longitude)
  //       })
  //     } else {
  //       console.log('ERROR. No location found')
  //     }
  //   }
  // }, []) // Empty array keeps the useEffect from looping

  // items =
  //   metarData != null ? (
  //     Object.keys(metarData).map(key => (
  //       <div
  //         key={key}
  //         className={`weather-card ${
  //           key === metarData.length - 1 ? 'weather-card-last' : ''
  //         }`}
  //       >
  //         <Link to={metarData[key].icao}>
  //           <div className='weather-row'>
  //             <p className='airport-name'>{metarData[key].station.name}</p>
  //             <p className='airport-code'>{metarData[key].icao}</p>
  //           </div>
  //           <div className='weather-row'>
  //             <div className='weather-row-left'>
  //               <p className='wind-speed-direction'>
  //                 {`${
  //                   metarData[key].wind !== undefined
  //                     ? metarData[key].wind.degrees + 'º'
  //                     : 'calm'
  //                 } ${
  //                   metarData[key].wind !== undefined
  //                     ? metarData[key].wind.speed_kts + 'kts'
  //                     : ''
  //                 } ${
  //                   metarData[key].wind === undefined
  //                     ? ''
  //                     : metarData[key].wind.gust_kts === undefined
  //                     ? ''
  //                     : metarData[key].wind.gust_kts
  //                 }`}
  //               </p>
  //               <p className='visibility'>
  //                 {`${
  //                   metarData[key].visibility !== undefined
  //                     ? metarData[key].visibility.miles + ' miles'
  //                     : ''
  //                 }`}
  //               </p>
  //               {metarData[key].clouds.map((item, index) => (
  //                 <p key={index + 1} className='sky-condition'>{`${item.code} ${
  //                   item.base_feet_agl ? item.base_feet_agl : ''
  //                 }`}</p>
  //               ))}
  //             </div>
  //             <div>
  //               <div className='weather-row-right'>
  //                 <div className='temp-dewpoint'>
  //                   <p className='temp'>{`${
  //                     metarData[key].temperature !== undefined
  //                       ? metarData[key].temperature.celsius + 'ºC'
  //                       : ''
  //                   }`}</p>
  //                   <p className='dewpoint'>{`${
  //                     metarData[key].dewpoint !== undefined
  //                       ? metarData[key].dewpoint.celsius + 'ºC'
  //                       : ''
  //                   } ${
  //                     metarData[key].humidity !== undefined
  //                       ? metarData[key].humidity.percent + '%'
  //                       : ''
  //                   }`}</p>
  //                   <p className='barometer'>{`${
  //                     metarData[key].barometer !== undefined
  //                       ? metarData[key].barometer.hg + ' inHg'
  //                       : ''
  //                   }`}</p>
  //                 </div>
  //                 <div
  //                   className={`flight-rules ${
  //                     metarData[key].flight_category === 'VFR'
  //                       ? 'flight-rules-vfr'
  //                       : metarData[key].flight_category === 'IFR'
  //                       ? 'flight-rules-ifr'
  //                       : metarData[key].flight_category === 'MVFR'
  //                       ? 'flight-rules-mvfr'
  //                       : metarData[key].flight_category === 'LIFR'
  //                       ? 'flight-rules-lifr'
  //                       : ''
  //                   }`}
  //                 >
  //                   <div className='flight-rules-text'>
  //                     {metarData[key].flight_category}
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </Link>
  //       </div>
  //     ))
  //   ) : (
  //     <div>Something happened</div>
  //   )

  // return (
  //   <>
  //     {isLoading ? (
  //       <i className='load-spinner fas fa-asterisk fa-spin fa-4x'></i>
  //     ) : (
  //       <div></div>
  //     )}
  //     <div
  //       className={`${!isLoading ? 'weather-card-wrapper' : 'loading-wrapper'}`}
  //     >
  //       {!isLoading ? items === undefined ? <div></div> : items : <div></div>}
  //     </div>
  //   </>
  // )
}

export default WeatherCard
