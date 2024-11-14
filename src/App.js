import { Oval } from 'react-loader-spinner';
import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function Grp204WeatherApp() {
    const [input, setInput] = useState('');
    const [weather, setWeather] = useState({
        loading: false,
        data: {},
        error: false,
    });
    const [forecast, setForecast] = useState([]);  // New state for forecast data

    const toDateFunction = () => {
        const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 
        'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        const WeekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const currentDate = new Date();
        const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
        return date;
    };

    const search = async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            setInput('');
            setWeather({ ...weather, loading: true });
            const currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
            const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
            const api_key = 'f00c38e0279b7bc85480c3fe775d518c';

            try {
                // Fetch current weather data
                const weatherResponse = await axios.get(currentWeatherUrl, {
                    params: {
                        q: input,
                        units: 'metric',
                        appid: api_key,
                    },
                });
                setWeather({ data: weatherResponse.data, loading: false, error: false });

                // Fetch 5-day forecast data
                const forecastResponse = await axios.get(forecastUrl, {
                    params: {
                        q: input,
                        units: 'metric',
                        appid: api_key,
                    },
                });
                
                // Filter the forecast to show one entry per day
                const dailyForecast = forecastResponse.data.list.filter(item =>
                    item.dt_txt.endsWith("12:00:00")
                );
                setForecast(dailyForecast);
            } catch (error) {
                setWeather({ ...weather, data: {}, error: true });
                setForecast([]); // Clear forecast data if there's an error
            }
        }
    };

    return (
        <div className="App">
            <h1 className="app-name">Application Météo grp204</h1>
            <div className="search-bar">
                <input
                    type="text"
                    className="city-search"
                    placeholder="Entrez le nom de la ville..."
                    name="query"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyPress={search}
                />
            </div>
            
            {/* Loading Spinner */}
            {weather.loading && (
                <div className="loading-spinner">
                    <Oval type="Oval" color="black" height={100} width={100} />
                </div>
            )}
        
            {/* Error Message */}
            {weather.error && (
                <div className="error-message">
                    <FontAwesomeIcon icon={faFrown} />
                    <span>Ville introuvable</span>
                </div>
            )}
        
            {/* Current Weather Info Display */}
            {weather && weather.data && weather.data.main && (
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

            {/* 5-Day Forecast Section */}
            {forecast.length > 0 && (
                <div className="forecast-section">
                    <h3>Prévisions sur 5 jours</h3>
                    <div className="forecast-cards">
                        {forecast.map((day, index) => (
                            <div key={index} className="forecast-card">
                                <p>{new Date(day.dt * 1000).toLocaleDateString('fr-FR', {
                                    weekday: 'long', month: 'short', day: 'numeric'
                                })}</p>
                                <img 
                                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} 
                                    alt={day.weather[0].description} 
                                />
                                <p>{Math.round(day.main.temp)}°C</p>
                                <p>{day.weather[0].description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Grp204WeatherApp;
