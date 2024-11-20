import { Oval } from "react-loader-spinner";
import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

function Grp204WeatherApp() {
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });
  const [theme, setTheme] = useState("day"); // État pour suivre le thème

  const toDateFunction = () => {
    const months = [
      "Janvier", "Février", "Mars", "Avril", "Mai", 
      "Juin", "Juillet", "Août", "Septembre", "Octobre", 
      "Novembre", "Décembre"
    ];
    const weekDays = [
      "Dimanche", "Lundi", "Mardi", "Mercredi", 
      "Jeudi", "Vendredi", "Samedi"
    ];
    const currentDate = new Date();
    const date = `${weekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
    return date;
  };

  const determineTheme = (timezoneOffset) => {
    const cityTime = new Date(new Date().getTime() + timezoneOffset * 1000);
    const hour = cityTime.getHours();

    if (hour >= 6 && hour < 18) {
      setTheme("day"); // Mode jour
    } else {
      setTheme("night"); // Mode nuit
    }
  };

  const search = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setWeather({ ...weather, loading: true });
      const url = "https://api.openweathermap.org/data/2.5/weather";
      const api_key = "f00c38e0279b7bc85480c3fe775d518c"; // Remplacez par votre clé API

      try {
        const res = await axios.get(url, {
          params: {
            q: input,
            units: "metric",
            appid: api_key,
          },
        });
        setWeather({ data: res.data, loading: false, error: false });
        determineTheme(res.data.timezone); // Mettre à jour le thème en fonction de l'heure locale
      } catch (error) {
        setWeather({ ...weather, data: {}, error: true });
      } finally {
        setInput(""); // Réinitialiser l'input après la recherche
      }
    }
  };

  return (
    <div className={`App ${theme}`}>
      <h1 className="app-name">Application Météo grp204</h1>
      <div className="search-bar">
        <input
          type="text"
          className="city-search"
          placeholder="Entrez le nom de la ville..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyPress={search}
        />
      </div>

      {/* Indicateur de chargement */}
      {weather.loading && (
        <div className="loading-spinner">
          <Oval type="Oval" color="black" height={100} width={100} />
        </div>
      )}

      {/* Message d'erreur */}
      {weather.error && (
        <div className="error-message">
          <FontAwesomeIcon icon={faFrown} />
          <span>Ville introuvable</span>
        </div>
      )}

      {/* Affichage des informations météo */}
      {weather.data.main && (
        <div className="weather-info">
          <h2>
            {weather.data.name}, {weather.data.sys.country}
          </h2>
          <span className="date">{toDateFunction()}</span>
          <img
            src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
            alt={weather.data.weather[0].description}
          />
          <p>{Math.round(weather.data.main.temp)}°C</p>
          <p>Vitesse du vent : {weather.data.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default Grp204WeatherApp;
