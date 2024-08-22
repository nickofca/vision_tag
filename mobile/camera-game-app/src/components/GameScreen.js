import React, { useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { uploadImage } from "../api";
import "./GameScreen.css"

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
  }, [websocket]);

  return (
    <div className={"container"}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className={"container__webcam"}
      />
      <div className={"container__crosshair"} />

      <ScoreBoard scores={scores} />

      <button onClick={handleEject} className={"button--eject"}>Eject</button>
      <button onClick={capture} className={"button--capture"}></button>
    </div>
  );
}

function ScoreBoard({ scores }) {
  return (
    <div className={"container__scoreboard"}>
      <h3>Scores</h3>
      <ul className={"container__scoreboard__list"}>
        {Object.entries(scores).map(([player, score]) => (
          <li key={player}>{player}: {score}</li>
        ))}
      </ul>
    </div>
  );
}

export default GameScreen;