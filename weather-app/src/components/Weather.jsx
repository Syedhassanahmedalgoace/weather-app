import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';

import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';

const Weather = () => {

    const inputRef = useRef()
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState('');

    const getIconByTemperature = (temp) => {
        if (temp <= 0) return snow_icon;
        if (temp >= 20) return rain_icon;

        if (temp > 0 && temp <= 15) return cloud_icon;
        if (temp > 15 && temp <= 25) return drizzle_icon;
        if (temp > 25) return clear_icon;
        return clear_icon;
    };

    const search = async (city) => {
        if (!city) return;
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.cod !== 200) {
                alert('City not found!');
                return;
            }

            const temp = Math.round(data.main.temp);
            let icon = getIconByTemperature(temp);

            console.log("Temp:", temp, "Selected Icon:", icon);

            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed.toFixed(2),
                temperature: temp,
                location: data.name,
                icon: icon,
            });
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    useEffect(() => {
        search('Malaysia');
    }, []);

    return (
        <div className='weather'>
            <div className='search-bar'>
                <input
                    ref={inputRef}
                    type='text'
                    placeholder='Search'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <img src={search_icon} alt='Search icon' onClick={() => search(inputRef.current.value)} />
            </div>
            {weatherData && (
                <>
                    <img src={weatherData.icon} alt='Weather icon' className='weather-icon' />
                    <p className='temperature'>{weatherData.temperature}℃</p>
                    <p className='location'>{weatherData.location}</p>
                    <div className='weather-data'>
                        <div className='col'>
                            <img src={humidity_icon} alt='Humidity icon' />
                            <div>
                                <p>{weatherData.humidity} %</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className='col'>
                            <img src={wind_icon} alt='Wind icon' />
                            <div>
                                <p>{weatherData.windSpeed} km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Weather;
