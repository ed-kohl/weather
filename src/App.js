import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import CurrentTime from "./CurrentTime";
import WeatherApp from "./WeatherApp";

/**
 * WeatherSearch component that displays weather information for a given city.
 * @returns {JSX.Element} The JSX element representing the WeatherSearch component.
 */
export default function WeatherSearch() {
  /*eslint-disable no-unused-vars*/
  const [city, setCity] = useState("");
  /*eslint-disable no-unused-vars*/
  const [loaded, setLoaded] = useState(false);
  /*eslint-disable no-unused-vars*/
  const [loading, setLoading] = useState(false);
  /*eslint-disable no-unused-vars*/
  const [weather, setWeather] = useState({});
  /*eslint-disable no-unused-vars*/
  const [error, setError] = useState(null);
  /*eslint-disable no-unused-vars*/
  const [unit, setUnit] = useState("celsius");
  /*eslint-disable no-unused-vars*/
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const toggleUnit = () => {
    setUnit(unit === "celsius" ? "fahrenheit" : "celsius");
  };

  let temperature = Math.round(weather.temperature);
  if (unit === "fahrenheit") {
    temperature = Math.round((temperature * 9) / 5 + 32);
  }

  function fetchWeather(city) {
    let apiKey = process.env.REACT_APP_API_KEY;
    setLoading(true);
    axios
      .get(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY`
      )
      .then(displayWeather)
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  }

  /*use axios and the openweather api  to call weather data*/

  function displayWeather(response) {
    setLoaded(true);
    setWeather({
      /*set the states in api responses - within the displayWeather function */

      temperature: response.data.main.temp,
      wind: response.data.wind.speed,
      humidity: response.data.main.humidity,
      icon: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
      description: response.data.weather[0].description,
    });
  }

  /* function to handle the submit of the form */
  function handleSubmit(event) {
    event.preventDefault();
    let apiKey = process.env.REACT_APP_API_KEY;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    /* use the apiURL in a displayWeatherfunction */
    axios.get(apiUrl).then(displayWeather);
  }

  /* set the Name of the city*/

  function updateCity(event) {
    setCity(event.target.value);
  }

  /*define a form as a variable*/

  let form = (
    <form onSubmit={handleSubmit}>
      <input type="search" placeholder="Enter a city.." onChange={updateCity} />
      <button type="Submit">Search</button>
    </form>
  );

  /* tell the app waht it should display, after the app has laoded
   */
  if (loaded) {
    return (
      <div className="App">
        <div className="SearchInProgress">
          <div className="form">{form}</div>
          <div className="time">
            <CurrentTime city={city} />
          </div>
        </div>
        <div className="Results">
          <ul>
            <li onClick={toggleUnit}>
              Temperature: {temperature}°{unit === "celsius" ? "C" : "F"}
            </li>
            <li>Humidity: {weather.humidity}%</li>
            <li>Wind: {weather.wind}km/h</li>
            <li>
              <img src={weather.icon} alt={weather.description} />
            </li>
          </ul>
        </div>

        <div className="Forecast">
          {Array(5)
            .fill()
            .map((_, index) => {
              const forecastDate = new Date();
              forecastDate.setDate(new Date().getDate() + index + 1); // Add 1 to index
              const weekday = weekdays[forecastDate.getDay()];
              return (
                <div className="Forecast-day" key={index}>
                  <p>{weekday}</p>
                  <p>Temperature: --°{unit === "celsius" ? "C" : "F"}</p>
                  <p>Humidity: --%</p>
                  <p>Wind: --km/h</p>
                  <img
                    src="http://openweathermap.org/img/w/01d.png"
                    alt="Clear sky"
                  />
                </div>
              );
            })}
        </div>
      </div>
    );
  } else {
    return (
      <div className="Container">
        <div>{form}</div>
        <div>
          <WeatherApp />
        </div>
      </div>
    );
  }
}
