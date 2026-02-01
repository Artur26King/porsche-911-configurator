import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterScreen from './components/RegisterScreen';
import LoginScreen from './components/LoginScreen';
import Home from './pages/Home';
import Models from './pages/Models';
import Configurator from './pages/Configurator';
import Profile from './pages/Profile';

function App() {
  const { user, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#0a0a0a',
        color: '#fff'
      }}>
        Loading...
      </div>
    );
  }

  // If not authenticated, show ONLY registration screen - block all routes
  if (!user) {
    return <RegisterScreen />;
  }

  // User is authenticated - show app with routes
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/models" element={<Models />} />
        <Route path="/configurator" element={<Configurator />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
