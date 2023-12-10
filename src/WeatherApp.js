import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 * WeatherApp component displays weather information based on user's location.
 * @returns {JSX.Element} The WeatherApp component.
 */
/**
 * WeatherApp component displays weather information based on user's location.
 * @returns {JSX.Element} The WeatherApp component.
 */
export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [unit, setUnit] = useState("celsius");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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

  function fetchWeather(lat, lon) {
    const apiKey = process.env.REACT_APP_API_KEY;
    axios
      .get(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      )
      .then((response) => {
        setWeather(response.data);
        console.log(response.data.main);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const forecastDays = forecast
    ? forecast.list.reduce((days, item, index) => {
        const dayIndex = Math.floor(index / 8);
        if (!days[dayIndex]) {
          days[dayIndex] = [item];
        } else {
          days[dayIndex].push(item);
        }
        return days;
      }, [])
    : [];

  function fetchForecast(lat, lon) {
    const apiKey = process.env.REACT_APP_API_KEY;
    axios
      .get(
        `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      )
      .then((response) => {
        setForecast(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchWeather(latitude, longitude);
      fetchForecast(latitude, longitude); // Call fetchForecast here
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const apiKey = process.env.REACT_APP_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

        axios
          .get(url)
          .then((response) => {
            setWeather(response.data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error: ", error);
            setError("Failed to fetch weather data");
            setIsLoading(false);
          });
      },
      (error) => {
        console.error("Error: ", error);
        setError("Failed to fetch location");
        setIsLoading(false);
      }
    );
  }, []);
  /*
  <div className="Results">
    <ul>
      {forecastDays.map((day, index) => (
        <li key={index} onClick={toggleUnit}>
          <p>
            Temperature: {day.temperature}°{unit === "celsius" ? "C" : "F"}
          </p>
          <p>Humidity: {day.humidity}%</p>
          <p>Wind: {day.wind}km/h</p>
          <img
            src={`http://openweathermap.org/img/w/${day.icon}.png`}
            alt="Weather icon"
          />
        </li>
      ))}
    </ul>
  </div>;
*/
  let temperature;
  if (weather) {
    let temperatureCelsius = Math.round(weather.main.temp);
    let temperatureFahrenheit = Math.round((temperatureCelsius * 9) / 5 + 32);

    if (unit === "celsius") {
      temperature = temperatureCelsius;
    } else {
      temperature = temperatureFahrenheit;
    }
  }

  if (isLoading) {
    return <div>Loading...</div>; // Replace this with your loading spinner
  }

  if (error) {
    return <div>{error}</div>; // Replace this with your error message
  }

  return (
    <div className="App">
      <div className="CurrentWeather">
        <h2>{weather.name}:</h2>
        <ul>
          <li onClick={toggleUnit}>
            {temperature}°{unit === "celsius" ? "C" : "F"}
          </li>
          <li>
            <img
              src={weather.weather[0].icon}
              alt={weather.weather[0].description}
            ></img>
          </li>
          <li>Humidity: {weather.main.humidity}%</li>
          <li>Wind: {weather.wind.speed} m/s</li>
          <li>
            Your current time:<br></br> {new Date().toLocaleTimeString()}
          </li>
        </ul>
      </div>
      <div className="Results">
        <ul>
          {forecastDays.map((day, index) => (
            <li key={index} onClick={toggleUnit}>
              <p>
                Temperature: {day.temperature}°{unit === "celsius" ? "C" : "F"}
              </p>
              <p>Humidity: {day.humidity}%</p>
              <p>Wind: {day.wind}km/h</p>
              <img
                src={`http://openweathermap.org/img/w/${day.icon}.png`}
                alt="Weather icon"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
