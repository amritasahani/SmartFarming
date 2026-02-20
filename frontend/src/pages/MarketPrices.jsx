import React, { useState, useEffect } from 'react';
import api from '../services/api';

const MarketPrices = () => {
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await api.get('/market');
                setPrices(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPrices();
    }, []);

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 0' }}>
            <h1 style={{ marginBottom: '1rem', color: 'var(--primary-dark)' }}>Live Market Prices</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Stay updated with the latest commodity prices in the market.</p>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading prices...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'var(--background)' }}>
                            <tr>
                                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>Crop Name</th>
                                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>Current Price (per quintal)</th>
                                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prices.map((p) => (
                                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{p.crop}</td>
                                    <td style={{ padding: '1rem' }}>₹{p.currentPrice}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            background: p.trend === 'up' ? 'rgba(74, 222, 128, 0.2)' : p.trend === 'down' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(226, 232, 240, 1)',
                                            color: p.trend === 'up' ? 'var(--primary-dark)' : p.trend === 'down' ? 'var(--danger)' : 'var(--text-muted)'
                                        }}>
                                            {p.trend === 'up' ? '↑' : p.trend === 'down' ? '↓' : '→'} {p.change}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MarketPrices;
