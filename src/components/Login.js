import React, { useState } from 'react';
import { api } from '../services/api';

function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.login(email, password);
      console.log('Login response:', response.data);
      
      // FastAPI OAuth2 returns: { access_token: "...", token_type: "bearer" }
      const { access_token } = response.data;
      
      if (access_token) {
        // Create user object (you might want to fetch user details separately)
        const userData = { email: email };
        
        // Call the onLogin callback with user data and token
        onLogin(userData, access_token);
      } else {
        setError('No access token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        setError('Invalid email or password');
      } else if (error.response?.status === 422) {
        setError('Invalid email format');
      } else {
        setError('Login failed: ' + (error.response?.data?.detail || error.message || 'Unknown error'));
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p>
          Don't have an account?{' '}
          <button type="button" onClick={onSwitchToRegister} className="link-btn">
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;