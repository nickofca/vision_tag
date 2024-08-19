from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict
from pydantic import BaseModel
import uuid


class Player(BaseModel):
    player_id: str
    score: int = 0

class GameEvent:
    def __init__(self, event_type: str, data: Dict):
        self.event_type = event_type
        self.data = data

class BaseGame:
    def __init__(self):
        self.game_id = uuid.uuid4()
        self.players: Dict[str, Player] = {}
        self.sockets: Dict[str, WebSocket] = {}

    async def add_player(self, player_id: str, websocket: WebSocket):
        self.players[player_id] = Player(player_id=player_id)
        self.sockets[player_id] = websocket

    async def remove_player(self, player_id: str):
        if player_id in self.players:
            del self.players[player_id]
            if player_id in self.sockets:
                await self.sockets[player_id].close()
                del self.sockets[player_id]
            await self.publish_event(GameEvent("player_left", {"player_id": player_id}))

    async def handle_event(self, event: GameEvent):
        if event.event_type == "action":
            player_id = event.data["player_id"]
            action_type = event.data["action_type"]
            await self.process_action(player_id, action_type)
        elif event.event_type == "update_score":
            player_id = event.data["player_id"]
            score_delta = event.data["score_delta"]
            await self.update_score(player_id, score_delta)

    async def process_action(self, player_id: str, action_type: str):
        # Example of processing different actions
        if action_type == "shoot":
            await self.update_score(player_id, 10)
        elif action_type == "collect_item":
            await self.update_score(player_id, 5)

    async def update_score(self, player_id: str, score_delta: int):
        if player_id in self.players:
            self.players[player_id].score += score_delta
            await self.publish_event(GameEvent("score_updated", {
                "player_id": player_id,
                "new_score": self.players[player_id].score
            }))

    async def publish_event(self, event: GameEvent):
        # Send event data to all connected players
        for player_id, websocket in self.sockets.items():
            try:
                await websocket.send_json({"event": event.event_type, "data": event.data})
            except WebSocketDisconnect:
                await self.remove_player(player_id)



