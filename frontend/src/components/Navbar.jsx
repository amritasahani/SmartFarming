import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMonitor, FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            padding: '1rem 0',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary-dark)' }}>
                    <FiMonitor size={24} /> SmartFarming
                </Link>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <Link to="/dashboard" style={{ fontWeight: 500 }}>Dashboard</Link>
                            <button onClick={handleLogout} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                                <FiLogOut /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/test" className="btn-secondary" style={{ padding: '0.5rem 1rem', border: 'none', background: 'transparent' }}>Test API</Link>
                            <Link to="/login" className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>Login</Link>
                            <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
