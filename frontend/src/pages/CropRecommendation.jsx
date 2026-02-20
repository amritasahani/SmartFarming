import React, { useState } from 'react';
import api from '../services/api';

const CropRecommendation = () => {
    const [formData, setFormData] = useState({
        soilType: 'Loamy', // Default value
        temperature: '',
        rainfall: '',
        season: 'Kharif'   // Default value
    });

    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [detecting, setDetecting] = useState(false); // State for auto-detect loading
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAutoDetect = async () => {
        setDetecting(true);
        setError(null);

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setDetecting(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Make an Axios call to our secure Express backend proxy
                    const res = await api.post('/crop/auto-detect', {
                        lat: latitude,
                        lon: longitude
                    });

                    const data = res.data;

                    // Auto-fill the form
                    setFormData({
                        soilType: data.soilType || 'Loamy',
                        temperature: data.temperature || '',
                        rainfall: data.rainfall || '',
                        season: data.season || 'Kharif'
                    });

                } catch (err) {
                    console.error("Auto detect error:", err);
                    setError("Failed to auto-detect environment. " + err.message);
                } finally {
                    setDetecting(false);
                }
            },
            (err) => {
                console.error("Geolocation error:", err);
                setError("Failed to get location. Please allow location access.");
                setDetecting(false);
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setRecommendation(null);

        try {
            // Send data to the backend API endpoint
            const res = await api.post('/crop/recommend', formData);
            setRecommendation(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to get recommendation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 0' }}>
            <h1 style={{ marginBottom: '1rem', color: 'var(--primary-dark)' }}>Smart Crop Recommendation</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Enter your farm's environmental conditions to receive an AI-driven rule-based crop recommendation and fertilizer advice.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>

                {/* Form Section */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                        <button
                            type="button"
                            onClick={handleAutoDetect}
                            disabled={detecting}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--primary)',
                                color: 'var(--primary)',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                cursor: detecting ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.875rem',
                                fontWeight: 'bold',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => { if (!detecting) { e.target.style.background = 'var(--primary)'; e.target.style.color = '#fff'; } }}
                            onMouseOut={(e) => { if (!detecting) { e.target.style.background = 'transparent'; e.target.style.color = 'var(--primary)'; } }}
                        >
                            {detecting ? '⏳ Detecting...' : '📍 Auto Detect Environment'}
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Soil Type</label>
                                <select
                                    className="form-input"
                                    name="soilType"
                                    value={formData.soilType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Sandy">Sandy</option>
                                    <option value="Clay">Clay</option>
                                    <option value="Loamy">Loamy</option>
                                    <option value="Black">Black</option>
                                    <option value="Red">Red</option>
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Season</label>
                                <select
                                    className="form-input"
                                    name="season"
                                    value={formData.season}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Kharif">Kharif (Monsoon)</option>
                                    <option value="Rabi">Rabi (Winter)</option>
                                    <option value="Zaid">Zaid (Summer)</option>
                                    <option value="All">All Season</option>
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Temperature (°C)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="form-input"
                                    name="temperature"
                                    placeholder="e.g. 25"
                                    value={formData.temperature}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label">Rainfall (mm)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="form-input"
                                    name="rainfall"
                                    placeholder="e.g. 120"
                                    value={formData.rainfall}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Analyzing...' : 'Get Recommendation'}
                        </button>

                        {error && <div style={{ color: 'var(--danger)', marginTop: '1rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '0.5rem' }}>{error}</div>}
                    </form>
                </div>

                {/* Results Section */}
                {recommendation && (
                    <div className="card glass-panel animate-fade-in" style={{ border: '2px solid var(--primary)', background: 'rgba(74, 222, 128, 0.05)' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Recommendation Results</h2>

                        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary-dark)', fontWeight: 'bold' }}>Optimal Crop</div>
                            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{recommendation.cropName}</div>
                        </div>

                        <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '1.5rem' }}>💡</span>
                                <h3 style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>Fertilizer & Growth Advice</h3>
                            </div>
                            <p style={{ lineHeight: 1.6, color: 'var(--text-main)' }}>
                                {recommendation.fertilizerAdvice}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CropRecommendation;
