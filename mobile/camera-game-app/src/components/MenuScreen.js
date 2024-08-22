import React, { useState, useEffect } from 'react';
import { signupUser, loginUser, createGame, joinGame, logoutUser } from '../api';
import "../App.css"
import FirstShotIcon from "../assets/icons/FirstShotIcon.png"
import DeathmatchIcon from "../assets/icons/skull.png"
import AssassinIcon from "../assets/icons/assassin.png"
import ImposterIcon from "../assets/icons/suspect.png"
import ScavengerIcon from "../assets/icons/vulture.png"
import CaptureTheFlagIcon from "../assets/icons/flag.png"
import "./MenuScreen.css"

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
        setToken(null);
        localStorage.removeItem('sessionToken');
        await logoutUser(token);
      }
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleCreateGame = (gameType) => {
    try {
      const ws = createGame(token, gameType);
      onStart(ws);  // Pass WebSocket instance to App component via onStart
    } catch (error) {
      console.error('Failed to create game:', error);
    }
  };

  const handleJoinGame = () => {
    try {
      const ws = joinGame(token, gameId);
      onStart(ws);  // Pass WebSocket instance to App component via onStart
    } catch (error) {
      console.error('Failed to join game:', error);
    }
  };

  return (
    <div  className={"centered-container"}>
      {!token ? (
        <>
          <div className={"centered-container"}>
          {isSignup ? (
            <h1>Create Account</h1>
          ) : (
              <h1>Log In</h1>
                )}
                  <input
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                  />
                  {isSignup && (
                      <input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                      />
                  )}
                  <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                  />
                  {isSignup && (
                      <div style={{marginBottom: '10px'}}>
                        <input
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={() => setAgreedToTerms(!agreedToTerms)}
                        />
                        <label>I agree with Terms & Conditions!</label>
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
                    <span style={{fontSize: '24px'}}>→</span>
                  </button>
                  <p style={{marginTop: '10px'}}>
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
                </div>
              </>
              ) : (
          <>
            <h1>Create Game</h1>
            <div className={"grid-container"}>
              <button onClick={() => handleCreateGame("FirstShot")} className="game-type-button">
                <div className="button-content">
                  <img src={FirstShotIcon} alt="Create First Shot Game" width="100" height="100"/>
                  <span>First Shot</span>
                </div>
              </button>
              <button className="disabled-game-type-button">
                <div className="button-content">
                  <img src={DeathmatchIcon} alt="Create Deathmatch Game" width="100" height="100"/>
                  <span>Deathmatch</span>
                </div>
              </button>
              <button className="disabled-game-type-button">
                <div className="button-content">
                  <img src={AssassinIcon} alt="Create Assassin Game" width="100" height="100"/>
                  <span>Assassin</span>
                </div>
              </button>
              <button className="disabled-game-type-button">
                <div className="button-content">
                  <img src={ImposterIcon} alt="Create Imposter Game" width="100" height="100"/>
                  <span>Imposter</span>
                </div>
              </button>
              <button className="disabled-game-type-button">
                <div className="button-content">
                  <img src={ScavengerIcon} alt="Create Scavenger Game" width="100" height="100"/>
                  <span>Scavenger</span>
                </div>
              </button>
              <button className="disabled-game-type-button">
                <div className="button-content">
                  <img src={CaptureTheFlagIcon} alt="Create Capture the Flag Game" width="100" height="100"/>
                  <span>Capture the Flag</span>
                </div>
              </button>
            </div>

            {/* Horizontal line added here */}
            <hr style={{width: '80%', margin: '20px auto', border: '1px solid #ccc'}}/>

            <h1>Join Game</h1>
            <input
                type="text"
                placeholder="Enter Game ID"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                style={{marginBottom: '10px', padding: '10px', borderRadius: '5px', width: '80%'}}
            />
            <button
                onClick={handleJoinGame}
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
              <span style={{fontSize: '24px'}}>→</span>
            </button>

            <a href="#" onClick={handleSignOut} className={"bottom-right-corner"}>Sign Out</a>
          </>
      )}
    </div>
  );
}

export default MenuScreen;