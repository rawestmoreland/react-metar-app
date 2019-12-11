import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import StationDetails from "../StationDetails/StationDetails";
import MetarCard from "./MetarCard";
import TafCard from "./TafCard";
import "./WeatherDetails.css";

import { getIcaoWeather } from "../../actions/icaoWeatherActions";
import { getIcaoTaf } from "../../actions/icaoTafActions";
import { getIcaoStation } from "../../actions/icaoStationActions";
import { getStationTimestamp } from "../../actions/stationTimestampActions";

class WeatherDetails extends Component {
  componentDidMount() {
    const icao = this.props.match.params.icao;
    console.log("resetting the values for a new city");
    this.props.getIcaoWeather(icao);
    this.props.getIcaoTaf(icao);
    this.props.getIcaoStation(icao);
    this.props.getStationTimestamp(icao);
  }

  static propTypes = {
    getIcaoWeather: PropTypes.func.isRequired,
    getIcaoTaf: PropTypes.func.isRequired,
    getIcaoStation: PropTypes.func.isRequired,
    getStationTimestamp: PropTypes.func.isRequired,
    stationDataLoading: PropTypes.bool,
    stationTimestampLoading: PropTypes.bool,
    weatherData: PropTypes.object.isRequired,
    tafData: PropTypes.object,
    stationData: PropTypes.object,
    stationTimestamp: PropTypes.object
  };

  render() {
    const {
      stationDataLoading,
      stationTimestampLoading,
      weatherData,
      tafData
    } = this.props;
    return (
      <div
        className={
          stationDataLoading && stationTimestampLoading
            ? "loading-wrapper"
            : "weather-details-wrapper"
        }
      >
        {!stationDataLoading && !stationTimestampLoading ? (
          <StationDetails />
        ) : (
          <div>
            <i className="load-spinner fas fa-asterisk fa-spin fa-3x"></i>
          </div>
        )}
        <div className="divider"></div>
        {!stationDataLoading && !stationTimestampLoading ? (
          weatherData ? (
            <MetarCard />
          ) : (
            <div></div>
          )
        ) : (
          <div></div>
        )}
        {!stationDataLoading && !stationTimestampLoading ? (
          tafData ? (
            <TafCard />
          ) : (
            <div></div>
          )
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  weatherData: state.icaoWeather.weatherData,
  tafData: state.icaoTaf.tafData,
  stationTimestamp: state.stationTimestamp.stationTimestamp,
  stationData: state.icaoStation.stationData,
  stationDataLoading: state.icaoStation.isLoading,
  stationTimestampLoading: state.stationTimestamp.isLoading
});

export default connect(mapStateToProps, {
  getIcaoWeather,
  getIcaoTaf,
  getIcaoStation,
  getStationTimestamp
})(WeatherDetails);
