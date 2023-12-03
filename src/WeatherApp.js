import React, { useEffect, useState } from "react";
import axios from "axios";

function WeatherApp() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const apiKey = process.env.REACT_APP_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

        axios
          .get(url)
          .then((response) => {
            setWeather(response.data);
          })
          .catch((error) => {
            console.error("Error: ", error);
          });
      },
      (error) => {
        console.error("Error: ", error);
      }
    );
  }, []);

  if (!weather) return <div>Loading...</div>;

  return (
    <div className="SearchInProgress">
      <h2>Weather in {weather.name}</h2>
      <p>{weather.main.temp}°C</p>
      <p>{weather.weather[0].description}</p>
      <p>Humidity: {weather.main.humidity}%</p>
      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  );
}

export default WeatherApp;
