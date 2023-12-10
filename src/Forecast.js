import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Forecast.css";

export default function Forecast({ city, unit }) {
  const [forecast, setForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  /*eslint-disable no-unused-vars*/
  const [error, setError] = useState(null);
  /*eslint-disable no-unused-vars*/
  const [loaded, setLoaded] = useState(false);
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    let apiKey = process.env.REACT_APP_SHECODES_API_KEY;
    setIsLoading(false);

    axios
      .get(
        `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}`
      )
      .then((response) => {
        console.log(response.data);
        setForecast(
          response.data.daily.map((day) => ({
            temperature: Math.round(day.temperature.maximum),
            wind: day.wind.speed,
            description: day.condition.description,
            icon: day.condition.icon,
            URL: day.condition.icon_url,
          }))
        );
        setLoaded(true);
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.message);
      });
  }, [city]); // Add city as a dependency to refetch when city changes

  // ... rest of the code
  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="Forecast">
      {forecast &&
        forecast.map((day, index) => {
          const forecastDate = new Date();
          forecastDate.setDate(new Date().getDate() + index + 1);
          const weekday = weekdays[forecastDate.getDay()];
          return (
            <section className="ContainForecast">
              <div className="Forecast-day" key={index}>
                <h3>{weekday}</h3>
                <p>
                  Temperature:
                  <br /> {day.temperature}
                  {unit === "celsius" ? "°C" : "F"}
                </p>
                <p>
                  Wind: <br /> {day.wind} km/h
                </p>
                <p>{day.description}</p>
                <img src={day.URL} alt="Weather icon"></img>
              </div>
            </section>
          );
        })}
    </div>
  );
}
