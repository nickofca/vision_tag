import React, { useState, useEffect } from 'react';
import { signupUser, loginUser, createGame, joinGame, logoutUser } from '../api';

function MenuScreen({ onStart }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('sessionToken'));
  const [gameId, setGameId] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('sessionToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSignup = async () => {
    if (!agreedToTerms) {
      alert("You must agree to the terms and conditions to sign up.");
      return;
    }
    try {
      const userData = await signupUser(username, email, password);
      console.log('User signed up:', userData);
      handleLogin(); // Auto-login after signup
    } catch (error) {
      console.error('Failed to sign up:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const token = await loginUser(username, password);
      setToken(token);
    } catch (error) {
      console.error('Failed to log in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      if (token) {
        await logoutUser(token);
      }
      setToken(null);
      localStorage.removeItem('sessionToken');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleCreateGame = () => {
    try {
      const ws = createGame(token);
      onStart(ws);  // Pass WebSocket instance to App component via onStart
    } catch (error) {
      console.error('Failed to create game:', error);
    }
  };

  const handleJoinGame = () => {
    try {
      const ws = joinGame(gameId, token);
      ws.onmessage = (event) => {
        onStart(ws);  // Pass WebSocket instance to App component via onStart
      };
    } catch (error) {
      console.error('Failed to join game:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#FFD700' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2>Welcome!</h2>
        <p>Sign in to Continue</p>
      </div>
      {!token ? (
        <>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', width: '80%' }}
          />
          {isSignup && (
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', width: '80%' }}
            />
          )}
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', width: '80%' }}
          />
          {isSignup && (
            <div style={{ marginBottom: '10px' }}>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={() => setAgreedToTerms(!agreedToTerms)}
              />
              <label style={{ marginLeft: '10px' }}>I agree with Terms & Conditions!</label>
            </div>
          )}
          <button
            onClick={isSignup ? handleSignup : handleLogin}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#000',
              color: '#fff',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '24px' }}>→</span>
          </button>
          <p style={{ marginTop: '10px' }}>
            {isSignup ? (
              <>
                Already have an account?{' '}
                <a href="#" onClick={() => setIsSignup(false)}>Login</a>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <a href="#" onClick={() => setIsSignup(true)}>Sign Up</a>
              </>
            )}
          </p>
        </>
      ) : (
        <>
          <button onClick={handleCreateGame} style={{ marginBottom: '10px' }}>Create Game</button>
          <input
            type="text"
            placeholder="Enter Game ID"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', width: '80%' }}
          />
          <button onClick={handleJoinGame} style={{ marginBottom: '10px' }}>Join Game</button>
          <button onClick={handleSignOut} style={{ marginTop: '10px' }}>Sign Out</button>
        </>
      )}
    </div>
  );
}

export default MenuScreen;