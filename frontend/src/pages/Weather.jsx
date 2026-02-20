import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Weather = () => {
    const [city, setCity] = useState('Farmville');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchWeather = async (searchCity = 'Farmville') => {
        setLoading(true);
        try {
            const res = await api.get(`/weather/${searchCity}`);
            setWeatherData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchWeather(city);
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 0' }}>
            <h1 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Weather Forecast</h1>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search for your city..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <button type="submit" className="btn-primary">Search</button>
                </form>
            </div>

            {loading ? (
                <div>Loading forecast...</div>
            ) : weatherData ? (
                <>
                    <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', color: 'white', border: 'none' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{weatherData.city}</h2>
                            <div style={{ fontSize: '1.25rem', opacity: 0.9 }}>{weatherData.current.condition}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '4rem', fontWeight: 'bold', lineHeight: 1 }}>{weatherData.current.temp}°C</div>
                            <div style={{ opacity: 0.9 }}>Humidity: {weatherData.current.humidity}% | Wind: {weatherData.current.windSpeed} km/h</div>
                        </div>
                    </div>

                    <h3 style={{ marginBottom: '1rem' }}>7-Day Forecast</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                        {weatherData.forecast.map((day, idx) => (
                            <div key={idx} className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                                <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{idx === 0 ? 'Today' : day.day}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{day.date}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary-dark)' }}>
                                    {day.tempMax}° <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>{day.tempMin}°</span>
                                </div>
                                <div style={{ fontSize: '0.9rem' }}>{day.condition}</div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div>Could not load weather data.</div>
            )}
        </div>
    );
};

export default Weather;
