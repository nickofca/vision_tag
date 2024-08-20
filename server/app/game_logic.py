from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict
from schemas import UserResponse, Player
import uuid


class BaseGame:
    def __init__(self):
        self.game_id = str(uuid.uuid4())
        self.players: Dict[str, Player] = {}
        self.sockets: Dict[str, WebSocket] = {}

    @property
    def user_score_dict(self) -> Dict[str, int]:
        return {player_id: player.score for player_id, player in self.players.items()}

    async def add_player(self, player_id: str, websocket: WebSocket):
        self.players[player_id] = Player(player_id=player_id)
        self.sockets[player_id] = websocket
        await self.publish_event(UserResponse(type="GameManagement", status=200, payload={"message": f"{player_id} joined the game."}))
        await self.publish_event(UserResponse(type="ScoreUpdate", status=200, payload=self.user_score_dict))

    async def remove_player(self, player_id: str):
        if player_id in self.players:
            del self.players[player_id]
            if player_id in self.sockets.keys():
                await self.sockets[player_id].close()
                del self.sockets[player_id]
            await self.publish_event(UserResponse(type="GameManagement", status=200, payload={"message": f"{player_id} left the game."}))
            await self.publish_event(UserResponse(type="ScoreUpdate", status=200, payload=self.user_score_dict))

    async def update_score(self, player_id: str, score_delta: int):
        if player_id in self.players:
            self.players[player_id].score += score_delta
            await self.publish_event(UserResponse(type="ScoreUpdate", status=200, payload=self.user_score_dict))

    async def publish_event(self, response: UserResponse):
        # Send event data to all connected players
        for player_id, websocket in self.sockets.items():
            try:
                await websocket.send_json(dict(response))
            except WebSocketDisconnect:
                await self.remove_player(player_id)


class BasicShooter(BaseGame):
    async def process_action(self, player_id: str, action_type: str, data: Dict):
        # Example of processing different actions
        if action_type == "SubmittedShot":
            await self.update_score(player_id, 10)

