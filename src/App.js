import { Oval } from 'react-loader-spinner';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function Grp204WeatherApp() {
  const [location, setLocation] = useState(null); // Pour stocker la localisation de l'utilisateur
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });

  const toDateFunction = () => {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 
      'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const weekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const currentDate = new Date();
    const date = `${weekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
    return date;
  };

  // Récupérer les données météo par coordonnées
  const fetchWeatherByCoordinates = async (latitude, longitude) => {
    const url = 'https://api.openweathermap.org/data/2.5/weather';
    const api_key = 'YOUR_API_KEY'; // Remplacez par votre clé API OpenWeatherMap

    setWeather({ ...weather, loading: true });
    try {
      const res = await axios.get(url, {
        params: {
          lat: latitude,
          lon: longitude,
          units: 'metric',
          appid: api_key,
        },
      });
      setWeather({ data: res.data, loading: false, error: false });
    } catch (error) {
      setWeather({ ...weather, data: {}, error: true });
    }
  };

  // Détecter automatiquement la localisation de l'utilisateur
  useEffect(() => {
    if (!location) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          fetchWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Error detecting location: ", error);
          setWeather({ ...weather, error: true });
        }
      );
    }
  }, [location]);

  return (
    <div className="App">
      <h1 className="app-name">Application Météo grp204</h1>
      
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
          <span>Impossible de détecter votre localisation ou d'obtenir les données météo.</span>
        </div>
      )}

      {/* Affichage des informations météo */}
      {weather.data.main && (
        <div className="weather-info">
          <h2>{weather.data.name}, {weather.data.sys.country}</h2>
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