import React from 'react';
import { fetchScore, uploadImage } from '../api';
import Webcam from 'react-webcam';
import ScoreBoard from './ScoreBoard';

function GameScreen() {
  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    uploadImage(imageSrc);
  }, [webcamRef]);

  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={{ width: '100%', height: '100%' }}
      />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '20px', height: '20px', backgroundColor: 'red', borderRadius: '50%' }} />
      <ScoreBoard />
      <button onClick={capture} style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)' }}>Take Picture</button>
    </div>
  );
}

export default GameScreen;