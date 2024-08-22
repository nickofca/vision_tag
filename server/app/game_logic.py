from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict
from schemas import UserResponse, Player
import uuid
import logging

from server.app.vision import process_image
from vision import predict, yolo_scoring


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
            if score_delta > 0:
                logging.info(f"{player_id} scored {score_delta} points.")
            elif score_delta < 0:
                logging.info(f"{player_id} lost {-score_delta} points.")
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
            image = await process_image(data["image"])
            results = await predict(image)
            if await yolo_scoring(results):
                logging.info(f"{player_id} hit a shot")
                await self.update_score(player_id, 10)
            else:
                logging.info(f"{player_id} missed a shot")


class FirstShot(BaseGame):
    def __init__(self):
        super().__init__()
        self.respawn_state: Dict[str, bool] = {}
        self.respawn_object_class: Dict[str, int]  = {}
        self.all_respawn()

    async def add_respawn_class(self, player_id: str, respawn_object_class: int):
        self.respawn_object_class[player_id] = respawn_object_class

    def all_respawn(self):
        self.respawn_state = dict.fromkeys(self.players, True)

    async def add_player(self, player_id: str, websocket: WebSocket):
        await super().add_player(player_id, websocket)
        self.respawn_state[player_id] = True

    async def process_action(self, player_id: str, action_type: str, data: Dict):
        # Example of processing different actions
        if action_type == "SubmittedShot":
            image = await process_image(data["image"])
            results = await predict(image)
            if not self.respawn_state[player_id] and await yolo_scoring(results, 0):
                # Initiate a respawn for all players
                self.all_respawn()
                # Publish respawn notice
                await self.publish_event(UserResponse(type="GameStateUpdate", status=200, payload={"GameState": "respawn"}))
                # Update score
                await self.update_score(player_id, 10)
                logging.info(f"{player_id} hit a shot")
            elif self.respawn_state[player_id] and await yolo_scoring(results,
                                                                      self.respawn_object_class[player_id]):
                # Initiate action for specified player
                self.respawn_state[player_id] = False
                # Send action notice
                await self.sockets[player_id].send_json(dict(UserResponse(type="GameStateUpdate",
                                                               status=200,
                                                               payload={"GameState": "action"})))
                logging.info(f"{player_id} respawned")
            else:
                logging.info(f"{player_id} missed a shot")
