from typing import Dict, Any
from server.app.db import r  # Assuming Redis is used for session management


async def start_game(game_id: int) -> bool:
    """Logic to start a game on the server."""
    game_data = r.hgetall(f"game:{game_id}")

    if not game_data:
        return False

    r.hset(f"game:{game_id}", "state", "started")

    return True


async def join_game(game_id: int, player_id: int) -> bool:
    """Logic to join a game on the server."""
    game_data = r.hgetall(f"game:{game_id}")

    if not game_data:
        return False

    if game_data.get(b"state") != b"started":
        return False

    session_data = r.hgetall(f"session:{game_id}")
    if not session_data:
        session_data = {"players": []}
    else:
        session_data["players"] = eval(session_data[b"players"].decode())

    if player_id in session_data["players"]:
        return True  # Player is already in the game

    session_data["players"].append(player_id)
    r.hset(f"session:{game_id}", "players", str(session_data["players"]))

    return True