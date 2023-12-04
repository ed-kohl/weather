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
function WeatherApp() {
  const [weather, setWeather] = useState(null);
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
      <div className="Forecast">
        {Array(5)
          .fill()
          .map((_, index) => {
            const forecastDate = new Date();
            forecastDate.setDate(new Date().getDate() + index + 1);
            const weekday = weekdays[forecastDate.getDay()];
            return (
              <div className="Forecast-day" key={index}>
                <h3>{weekday}</h3>
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
}
export default WeatherApp;
