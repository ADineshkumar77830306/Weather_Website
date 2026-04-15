import React, { useEffect, useRef, useState } from "react";
import "./App.css";

import Cloudy from "./videos/cloudy.mp4";
import Default from "./videos/default.mp4";
import Drizzle from "./videos/drizzle.mp4";
import Foggy from "./videos/foggy.mp4";
import Rainy from "./videos/rainy.mp4";
import Snowy from "./videos/snowy.mp4";
import Sunny from "./videos/sunny.mp4";
import Thunderstorm from "./videos/thunderstorm.mp4";
import Tornado from "./videos/tornado.mp4";

const API_KEY = "5b74e87158f9cad9592fdfeac5683b9f";

function App() {
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [message, setMessage] = useState("");
  const [video, setVideo] = useState(Default);

  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [video]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      getWeather(city);
      setCity("");
    }
  };

  const getWeather = async (city) => {
    try {
      setWeather(null);
      setMessage(`⏳ Fetching weather for ${city}...`);

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!res.ok) throw new Error("City not found");

      const data = await res.json();
      displayWeather(data);
    } catch (err) {
      setMessage("❌ City not found or network error");
      setVideo(Default);
    }
  };

  const displayWeather = (data) => {
    const condition = data.weather[0].description.toLowerCase();
    const { icon, video } = getWeatherAssets(condition);

    setVideo(video);

    setWeather({
      city: data.name,
      country: data.sys.country,
      temp: Math.round(data.main.temp),
      feels: Math.round(data.main.feels_like),
      desc: data.weather[0].description,
      humidity: data.main.humidity,
      wind: data.wind.speed,
      pressure: data.main.pressure,
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      icon,
    });

    setMessage("");
  };

  const getWeatherAssets = (condition) => {
    if (condition.includes("clear")) return { icon: "☀️", video: Sunny };
    if (condition.includes("cloud")) return { icon: "☁️", video: Cloudy };
    if (condition.includes("rain")) return { icon: "🌧️", video: Rainy };
    if (condition.includes("drizzle")) return { icon: "🌦️", video: Drizzle };
    if (condition.includes("snow")) return { icon: "❄️", video: Snowy };
    if (condition.includes("thunder")) return { icon: "⛈️", video: Thunderstorm };
    if (
      condition.includes("mist") ||
      condition.includes("fog") ||
      condition.includes("haze")
    )
      return { icon: "🌫️", video: Foggy };
    if (condition.includes("tornado"))
      return { icon: "🌪️", video: Tornado };

    return { icon: "🌤️", video: Default };
  };

  return (
    <div className="app">
      {loading && <div className="initial-load">Loading Weather App...</div>}

      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        key={video}
        id="bg-video"
      >
        <source src={video || Default} type="video/mp4" />
      </video>

      {/* 🔥 PREMIUM HEADER */}
      <div className="app-header">
        <h1 className="app-title">Weather App</h1>
        <p className="app-subtitle">
          Experience real-time weather with stunning visuals 🌍
        </p>
      </div>

      {/* Weather UI */}
      <div className="weather-box">
        <div className="weather-info">
          {message && (
            <>
              <div className="loading-spinner">⏳</div>
              <p>{message}</p>
            </>
          )}

          {weather && (
            <>
              <h2>
                {weather.city}, {weather.country}
              </h2>
              <div style={{ fontSize: "3rem" }}>{weather.icon}</div>
              <p className="temperature">{weather.temp}°C</p>
              <p className="conditions">{weather.desc}</p>
              <p>Feels like: {weather.feels}°C</p>

              <div className="weather-details">
                <div className="weather-detail-item">
                  💧 {weather.humidity}%
                </div>
                <div className="weather-detail-item">
                  💨 {weather.wind} m/s
                </div>
                <div className="weather-detail-item">
                  📊 {weather.pressure} hPa
                </div>
              </div>

              <div className="sun-times">
                🌅 {weather.sunrise} | 🌇 {weather.sunset}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <form className="prompt-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="prompt-input"
          placeholder="Search any city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          autoFocus
        />
        <div className="prompt-actions">
          <button type="submit">🔍</button>
        </div>
      </form>
    </div>
  );
}

export default App;