import React, { useEffect, useState } from "react";
import axios from "axios";

function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState("celsius");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (isLoading) {
    return <div>Loading...</div>; // Replace this with your loading spinner
  }

  if (error) {
    return <div>{error}</div>; // Replace this with your error message
  }

  let temperature = Math.round(weather.main.temp);
  if (unit === "fahrenheit") {
    temperature = Math.round((temperature * 9) / 5 + 32);
  }
  const data = [
    {
      name: "Weather Data",
      Temperature: temperature,
      Humidity: weather.main.humidity,
      Wind: weather.wind.speed,
    },
  ];
  return (
    <div className="SearchInProgress">
      <div>
        <div>
          <span>
            <h2>{weather.name}:</h2>
          </span>

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
      </div>
    </div>
  );
}

export default WeatherApp;
