import React from 'react';

function MenuScreen({ onStart }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <button onClick={onStart}>Start Game</button>
    </div>
  );
}

export default MenuScreen;