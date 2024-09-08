import React, { useState } from 'react';
import MenuScreen from './components/MenuScreen';
import GameScreen from './components/GameScreen';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [websocket, setWebsocket] = useState(null);

  const handleStart = (ws) => {
    setWebsocket(ws);  // Store WebSocket instance
    setGameStarted(true);  // Transition to game screen
  };

  return (
    <div className="App">
      {gameStarted ? (
        <GameScreen websocket={websocket} setStartGame={setGameStarted} />
      ) : (
        <MenuScreen onStart={handleStart} />
      )}
    </div>
  );
}

export default App;