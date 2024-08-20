from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect, Depends
from auth import register_user, authenticate_user, token_required, logout, generate_token, decode_token
from schemas import UserCreate, UserLogin, UserResponse
from game_logic import BasicShooter
import json
import logging


router = APIRouter()
connected_clients = []
games = {}

@router.websocket("/ws/create_game/")
async def websocket_create_game(websocket: WebSocket):
    # Authenticate
    token = websocket.query_params.get('token')
    try:
        player_id = decode_token(token)
    except HTTPException as e:
        await websocket.close(code=e.status_code,
                              reason=str(e.detail))
        raise e

    # Accept connection
    await websocket.accept()

    try:
        # Initiate game
        game = BasicShooter()
        games[game.game_id] = game
        message = json.dumps({"status": "200",
                              "data": {"message": "Game created",
                                       "game_id": game.game_id}})
        await websocket.send_text(message)
        # Add player to game with websocket to publish events
        await game.add_player(player_id, websocket)

        while True:
            # Listen for events
            message = await websocket.receive()
            # Check for authorization
            if message["text"] == "Connection established":
                logging.info(f"Connection established - {websocket.client.host}")
                continue
            response_dict = json.loads(message["text"])
            payload = json.loads(response_dict["payload"])
            # Confirm token
            player_id = decode_token(response_dict["token"])
            # Pass event to game
            await game.process_action(player_id,
                                      response_dict["type"],
                                      payload)

    except WebSocketDisconnect:
        print("Client disconnected")

@router.websocket("/ws/join_game/{game_id}")
async def websocket_join_game(websocket: WebSocket, game_id: int):
    # Authenticate
    token = websocket.query_params.get('token')
    player_id = decode_token(token)

    # Accept connection
    await websocket.accept()

    try:
        # Load in game
        game = games[game_id]
        await websocket.send_text(f"Game joined with ID: {game.game_id}")
        # Add player to game with websocket to publish events
        await game.add_player(player_id, websocket)

        while True:
            # Listen for events
            message = await websocket.receive_text()
            # Confirm token
            player_id = decode_token(message.token)
            # Pass event to game
            await game.process_action(player_id, message.action_message,
                                      message.action_data)

    except WebSocketDisconnect:
        print("Client disconnected")

@router.post("/signup/", response_model=UserResponse)
async def signup_endpoint(data: UserCreate):
    """Sign up a new user."""
    try:
        confirmation_message = register_user(data.username, data.password)
        return UserResponse(type="Authorization", status=200, payload={"message": "User registration successful."})
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login/", response_model=UserResponse)
async def login_endpoint(data: UserLogin):
    """Log in an existing user."""
    try:
        player_id = authenticate_user(data.username, data.password)
        if player_id:
            # Generate session token
            return UserResponse(type="Authorization", status=200, payload={"message":"Authentication successful", "token": generate_token(player_id)})
        else:
            raise HTTPException(status_code=400, detail="Invalid credentials")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/logout/", response_model=UserResponse)
async def logout_endpoint(player_id: str = Depends(token_required)):
    """Log out the current user."""
    try:
        logout(player_id)
        return UserResponse(type="Authorization", status=200, payload={"message": "Logged out successfully"})
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))