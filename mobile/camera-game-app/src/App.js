import React, { useState } from 'react';
import MenuScreen from './components/MenuScreen';
import GameScreen from './components/GameScreen';

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="App">
      {gameStarted ? <GameScreen /> : <MenuScreen onStart={() => setGameStarted(true)} />}
    </div>
  );
}

export default App;