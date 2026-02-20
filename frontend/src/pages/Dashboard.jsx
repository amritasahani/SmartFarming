import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import api from '../services/api';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [weather, setWeather] = useState(null);
    const [prices, setPrices] = useState([]);
    const [cropHistory, setCropHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock Notifications
    const notifications = [
        { id: 1, type: 'alert', message: 'Heavy rainfall expected tomorrow. Secure open harvested crops!', time: '2 hours ago' },
        { id: 2, type: 'info', message: 'Market price for Wheat has gone up by 4% today.', time: '5 hours ago' },
        { id: 3, type: 'success', message: 'Your soil health report is ready for review.', time: '1 day ago' },
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Fetch Data in parallel
                const [weatherRes, marketRes, historyRes] = await Promise.all([
                    api.get('/weather/Farmville').catch(() => ({ data: null })),
                    api.get('/market').catch(() => ({ data: [] })),
                    api.get('/crop/history').catch(() => ({ data: [] }))
                ]);

                setWeather(weatherRes.data);

                // Format Market Prices for Chart
                if (marketRes.data && marketRes.data.length > 0) {
                    const chartData = marketRes.data.map(item => ({
                        name: item.crop,
                        price: item.currentPrice,
                        previous: parseInt(item.currentPrice) - (item.trend === 'up' ? 50 : -50) // Mocking previous day for trend line
                    }));
                    setPrices(chartData.slice(0, 5)); // Show top 5 in chart
                }

                // Format Crop History for Chart & List
                setCropHistory(historyRes.data);

            } catch (err) {
                console.error("Error fetching dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="container animate-fade-in" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading your agricultural dashboard...</div>;
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Overview Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back, <strong>{user?.name || 'Farmer'}</strong>. Here is your daily summary.</p>
                </div>
                <div>
                    <Link to="/crop" className="btn-primary" style={{ padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>+</span> New Crop Analysis
                    </Link>
                </div>
            </div>

            {/* Top Row: Weather & Notifications */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>

                {/* Weather Summary Card */}
                <div className="card glass-panel" style={{ background: 'linear-gradient(135deg, var(--surface) 0%, rgba(20, 184, 166, 0.05) 100%)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>⛅ Local Weather</h3>
                        <Link to="/weather" style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>7-Day Forecast &rarr;</Link>
                    </div>

                    {weather ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--text-main)', lineHeight: 1 }}>
                                    {weather.current.temp}°
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>{weather.city}</div>
                                    <div style={{ color: 'var(--text-muted)' }}>{weather.current.condition}</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                <div>Humidity: <strong>{weather.current.humidity}%</strong></div>
                                <div>Wind: <strong>{weather.current.windSpeed} km/h</strong></div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ color: 'var(--text-muted)' }}>Weather data unavailable.</div>
                    )}
                </div>

                {/* Notifications Card */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>🔔 Recent Alerts</h3>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {notifications.map(note => (
                            <div key={note.id} style={{
                                display: 'flex', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem',
                                background: note.type === 'alert' ? 'rgba(239, 68, 68, 0.1)' : note.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                borderLeft: `4px solid ${note.type === 'alert' ? '#ef4444' : note.type === 'success' ? '#22c55e' : '#3b82f6'}`
                            }}>
                                <div style={{ fontSize: '1.25rem' }}>
                                    {note.type === 'alert' ? '⚠️' : note.type === 'success' ? '✅' : 'ℹ️'}
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.25rem', fontWeight: 500 }}>{note.message}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{note.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Middle Row: Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>

                {/* Market Price Trends Chart */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ color: 'var(--text-main)' }}>📈 Live Market Trends (₹/q)</h3>
                        <Link to="/market" style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>View All Markets &rarr;</Link>
                    </div>
                    {prices.length > 0 ? (
                        <div style={{ height: 250, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={prices} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} width={45} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(20, 184, 166, 0.1)' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="price" name="Current Price" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                    <Bar dataKey="previous" name="Yesterday" fill="var(--secondary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No market data available yet.</div>
                    )}
                </div>

                {/* Crop History Overview */}
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>📋 Your Recent Crop Analysis</h3>
                    {cropHistory.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {cropHistory.slice(0, 4).map((record) => (
                                <div key={record._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: 'var(--primary-dark)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{record.recommendedCrop}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            {record.season} • {record.soilType} Soil • {record.temperature}°C
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--surface)', padding: '0.25rem 0.75rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                                        {new Date(record.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>End of recent history.</span>
                            </div>
                        </div>
                    ) : (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌱</div>
                            <p style={{ marginBottom: '1rem' }}>You haven't run any crop analysis yet.</p>
                            <Link to="/crop" className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Start First Analysis</Link>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
