import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved token on component mount
    const savedToken = localStorage.getItem('token');
    console.log('App mounted, checking for saved token:', savedToken);
    
    if (savedToken) {
      // If token exists, set it and go to dashboard
      setToken(savedToken);
      setCurrentPage('dashboard');
      // You might want to validate the token here with an API call
    } else {
      // No token, show login
      setCurrentPage('login');
    }
    
    setIsLoading(false);
  }, []);

  const handleLogin = (userData, authToken) => {
    console.log('Login successful:', userData, authToken);
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    console.log('Logging out');
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    setCurrentPage('login');
  };

  console.log('App state:', { currentPage, token: !!token, user });

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>🌍 Travel Itinerary Generator</h1>
        {currentPage === 'dashboard' && token && (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        )}
      </header>
      
      <main className="app-main">
        {currentPage === 'login' && (
          <Login 
            onLogin={handleLogin}
            onSwitchToRegister={() => setCurrentPage('register')}
          />
        )}
        
        {currentPage === 'register' && (
          <Register 
            onRegister={() => setCurrentPage('login')}
            onSwitchToLogin={() => setCurrentPage('login')}
          />
        )}
        
        {currentPage === 'dashboard' && token && (
          <Dashboard token={token} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
}

export default App;