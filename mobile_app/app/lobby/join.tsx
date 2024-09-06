import React, {useState} from "react";

import {joinGame} from "@components/api";


export default function createGameComponent () {
    const [gameId, setGameId] = useState('');


    return (
        <>
            <h1>Join Game</h1>
            <input
                type="text"
                placeholder="Enter Game ID"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                style={{marginBottom: '10px', padding: '10px', borderRadius: '5px', width: '80%'}}
            />
            <button
                onClick={joinGame}
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
        </>
    )
}