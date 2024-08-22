import React, { useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { uploadImage } from "../api";

function GameScreen({ websocket, setStartGame }) {
  const webcamRef = React.useRef(null);
  const [scores, setScores] = useState({});  // State to hold the score data

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    const token = localStorage.getItem('sessionToken');
    uploadImage(websocket, imageSrc, token);
  }, [webcamRef, websocket]);

  const handleEject = useCallback(() => {
    setStartGame(false); // Set the game status to false
    if (websocket) {
      websocket.close(); // Close the WebSocket connection
      // Send exit game message to server (if needed)
      websocket.send(JSON.stringify({ type: 'ExitGame' }));
    }
  }, [websocket, setStartGame]);

  useEffect(() => {
    if (websocket) {
      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'ScoreUpdate' && data.payload) {
          setScores(data.payload);
        }
      };
    }
  }, []);

  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={{ width: '100%', height: '100%' }}
      />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '20px', height: '20px', backgroundColor: 'red', borderRadius: '50%' }} />
      <ScoreBoard scores={scores} />

      <button onClick={handleEject} className={"button--eject"}>Eject</button>
      <button onClick={capture} className={"button--capture"}></button>
    </div>
  );
}

function ScoreBoard({ scores }) {
  return (
    <div style={{ position: 'absolute', top: 20, right: 20, backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', padding: '10px', borderRadius: '8px' }}>
      <h3>Scores</h3>
      <ul>
        {Object.entries(scores).map(([player, score]) => (
          <li key={player}>{player}: {score}</li>
        ))}
      </ul>
    </div>
  );
}

export default GameScreen;