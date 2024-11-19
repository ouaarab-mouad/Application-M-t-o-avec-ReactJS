import { Oval } from 'react-loader-spinner';
import React, { useState, useEffect } from 'react';
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
    const [favorites, setFavorites] = useState([]); // State pour gérer les villes favorites

    // Charger les favoris depuis le localStorage au démarrage
    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    // Fonction pour enregistrer les favoris dans le localStorage
    const saveFavorites = (updatedFavorites) => {
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setFavorites(updatedFavorites);
    };

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
            const url = 'https://api.openweathermap.org/data/2.5/weather';
            const api_key = 'f00c38e0279b7bc85480c3fe775d518c';

            try {
                const weatherResponse = await axios.get(url, {
                    params: {
                        q: input,
                        units: 'metric',
                        appid: api_key,
                    },
                });
                setWeather({ data: weatherResponse.data, loading: false, error: false });
            } catch (error) {
                setWeather({ ...weather, data: {}, error: true });
            }
        }
    };

    // Ajouter une ville aux favoris
    const addFavorite = () => {
        if (!favorites.includes(weather.data.name)) {
            const updatedFavorites = [...favorites, weather.data.name];
            saveFavorites(updatedFavorites);
        }
    };

    // Charger la météo d'une ville favorite
    const loadFavorite = async (city) => {
        setInput('');
        setWeather({ ...weather, loading: true });
        const url = 'https://api.openweathermap.org/data/2.5/weather';
        const api_key = 'f00c38e0279b7bc85480c3fe775d518c';

        try {
            const weatherResponse = await axios.get(url, {
                params: {
                    q: city,
                    units: 'metric',
                    appid: api_key,
                },
            });
            setWeather({ data: weatherResponse.data, loading: false, error: false });
        } catch (error) {
            setWeather({ ...weather, data: {}, error: true });
        }
    };

    return (
        <div className="App">
            <h1 className="app-name">Application Météo grp204</h1>

            {/* Barre de recherche */}
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
                {weather && weather.data && weather.data.name && (
                    <button className="favorite-button" onClick={addFavorite}>
                        Ajouter aux favoris
                    </button>
                )}
            </div>

            {/* Liste des favoris */}
            {favorites.length > 0 && (
                <div className="favorites-section">
                    <h3>Villes favorites</h3>
                    <ul className="favorites-list">
                        {favorites.map((city, index) => (
                            <li key={index} className="favorite-item" onClick={() => loadFavorite(city)}>
                                {city}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Spinner de chargement */}
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
        
            {/* Informations sur la météo actuelle */}
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
        </div>
    );
}

export default Grp204WeatherApp;
