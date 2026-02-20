import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CropRecommendation from './pages/CropRecommendation';
import Weather from './pages/Weather';
import MarketPrices from './pages/MarketPrices';
import AIChatbot from './pages/AIChatbot';
import TestBackend from './pages/TestBackend';

const Placeholder = ({ title }) => (
  <div className="container animate-fade-in" style={{ padding: '2rem 0' }}>
    <div className="card"><h2>{title} Page - Coming Soon</h2></div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/test" element={<TestBackend />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

              <Route path="/crop" element={<ProtectedRoute><CropRecommendation /></ProtectedRoute>} />
              <Route path="/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
              <Route path="/market" element={<ProtectedRoute><MarketPrices /></ProtectedRoute>} />
              <Route path="/ai-chat" element={<ProtectedRoute><AIChatbot /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
