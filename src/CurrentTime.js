import React, { useState, useEffect } from "react";
import "./CurrentTime.css";

function CurrentTime({ city }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="Time">
      <p>The time: {time.toLocaleTimeString()}</p>
      <p>Your search: {city}</p>
    </div>
  );
}

export default CurrentTime;
