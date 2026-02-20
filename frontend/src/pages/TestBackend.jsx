import React, { useState, useEffect } from 'react';
import api from '../services/api';

const TestBackend = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const testConnection = async () => {
            try {
                // Call the /api/test endpoint
                const response = await api.get('/test');
                setMessage(response.data.message);
                setError(null);
            } catch (err) {
                console.error("Connection error:", err);
                setError(err.message || "Failed to connect to backend");
                setMessage('');
            } finally {
                setLoading(false);
            }
        };

        testConnection();
    }, []);

    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
            <div className="card glass-panel" style={{ textAlign: 'center', maxWidth: '500px', width: '100%' }}>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>Backend Connection Test</h2>

                {loading && (
                    <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
                        Connecting to server...
                    </div>
                )}

                {!loading && error && (
                    <div style={{ padding: '2rem', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Connection Failed</h3>
                        <p>{error}</p>
                        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            Please check that your backend server is running on port 5000.
                        </p>
                    </div>
                )}

                {!loading && message && (
                    <div style={{ padding: '2rem', color: 'var(--primary-dark)', background: 'rgba(74, 222, 128, 0.1)', borderRadius: '0.5rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Connection Successful!</h3>
                        <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Server says: "{message}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestBackend;
