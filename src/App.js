import React, { useState } from "react";
import axios from "axios";
import "./App.css";

/**
 * WeatherSearch component that displays weather information for a given city.
 * @returns {JSX.Element} The JSX element representing the WeatherSearch component.
 */
export default function WeatherSearch() {
  /* Notes for  myself for later: define use states*/

  const [city, setCity] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [weather, setWeather] = useState({});

  /*use axios and the openweather api  to call weather data*/

  function displayWeather(response) {
    setLoaded(true);
    setWeather({
      /*set the states in api responses - within the displayWeather function */

      temperature: response.data.main.temp,
      wind: response.data.wind.speed,
      humidity: response.data.main.humidity,
      icon: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
      description: response.data.weather[0].description
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
      <div class="App">
        {form}
        <ul>
          <li>Temperature: {Math.round(weather.temperature)}°C</li>
          <li>Description: {weather.description}</li>
          <li>Humidity: {weather.humidity}%</li>
          <li>Wind: {weather.wind}km/h</li>
          <li>
            <img src={weather.icon} alt={weather.description} />
          </li>
        </ul>
      </div>
    );
  } else {
    return form;
  }
}
