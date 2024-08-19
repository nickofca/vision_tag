import React, { useState, useEffect } from 'react';
import { signupUser, loginUser, createGame, joinGame } from '../api';

function MenuScreen({ onStart }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('sessionToken'));
  const [gameId, setGameId] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('sessionToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSignup = async () => {
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
      const userData = await loginUser(username, password);
      console.log('User logged in:', userData);
      if (userData.token) {
        setToken(userData.token);
        localStorage.setItem('sessionToken', userData.token);
      }
    } catch (error) {
      console.error('Failed to log in:', error);
    }
  };

  const handleSignOut = () => {
    setToken(null);
    localStorage.removeItem('sessionToken');
  };

  const handleCreateGame = () => {
    try {
      const ws = createGame(token);
      ws.onmessage = (event) => {
        console.log('Game created:', event.data);
        onStart();
      };
    } catch (error) {
      console.error('Failed to create game:', error);
    }
  };

  const handleJoinGame = () => {
    try {
      const ws = joinGame(gameId, token);
      ws.onmessage = (event) => {
        console.log('Joined game:', event.data);
        onStart();
      };
    } catch (error) {
      console.error('Failed to join game:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {!token ? (
        <>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          {isSignup && (
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginBottom: '10px' }}
            />
          )}
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          {isSignup ? (
            <>
              <button onClick={handleSignup} style={{ marginBottom: '10px' }}>Sign Up</button>
              <p>
                Already have an account?{' '}
                <a href="#" onClick={() => setIsSignup(false)}>Login</a>
              </p>
            </>
          ) : (
            <>
              <button onClick={handleLogin} style={{ marginBottom: '10px' }}>Login</button>
              <p>
                Don't have an account?{' '}
                <a href="#" onClick={() => setIsSignup(true)}>Sign Up</a>
              </p>
            </>
          )}
        </>
      ) : (
        <>
          <button onClick={handleCreateGame} style={{ marginBottom: '10px' }}>Create Game</button>
          <input
            type="text"
            placeholder="Enter Game ID"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <button onClick={handleJoinGame} style={{ marginBottom: '10px' }}>Join Game</button>
          <button onClick={handleSignOut} style={{ marginTop: '10px' }}>Sign Out</button>
        </>
      )}
    </div>
  );
}

export default MenuScreen;