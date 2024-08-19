from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List
import json
import asyncio

app = FastAPI()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            # Handling client messages
            if message["type"] == "shot_fired":
                # Process the photo (message["photo"]) and respond
                print(f"Shot fired with photo: {message['photo']}")
                await manager.broadcast("Shot fired received")

    except WebSocketDisconnect:
        manager.disconnect(websocket)


async def disable_player(player_id, disable_duration_seconds):
    # Send the disable player notice
    await manager.send_personal_message(json.dumps({"type": "disable_player"}), player_id)

    # Wait required disable duration (non-blocking)
    await asyncio.sleep(disable_duration_seconds)

    # Send the re-enable player notice
    await manager.send_personal_message(json.dumps({"type": "reenable_player"}), player_id)


async def increment_score(game_id, player_id, score_increment):
    # Increment score in redis database

    # Get updated scoreboard
    # Send out scores to players
    await manager.broadcast(json.dumps({"type": "update_scores", "scores": score_increment}))

@app.get("/end_round")
async def end_round():
    await manager.broadcast(json.dumps({"type": "round_end"}))
    return {"status": "Round ended"}