import redis
import asyncpg
from typing import Dict, Any, List

# Connect to Redis
r = redis.Redis(host='localhost', port=6379, db=0)

# Asynchronous PostgreSQL connection setup
async def create_postgres_pool():
    """Create a connection pool for PostgreSQL."""
    return await asyncpg.create_pool(
        user='your_db_user',
        password='your_db_password',
        database='your_db_name',
        host='your_db_host',
        port='your_db_port'
    )

# Define the schema for different components
SCHEMA = {
    'player': {
        'player_id': int,
        'name': str,
        'level': int,
        'experience': int,
    },
    'game': {
        'game_id': int,
        'name': str,
        'max_players': int,
    },
    'session': {
        'session_id': int,
        'game_id': int,
        'players': list,
    },
    'score': {
        'player_id': int,
        'game_id': int,
        'score': int,
    }
}

def validate_schema(schema: Dict[str, Any], data: Dict[str, Any]) -> bool:
    """Validate data against a schema.

    Args:
        schema (dict): The expected schema.
        data (dict): The data to validate.

    Returns:
        bool: True if data is valid, raises ValueError or TypeError if invalid.
    """
    for key, expected_type in schema.items():
        if key not in data:
            raise ValueError(f"Missing key: {key} in data")
        if not isinstance(data[key], expected_type):
            raise TypeError(f"Incorrect type for key: {key}. Expected {expected_type}, got {type(data[key])}")
    return True

# Player operations using PostgreSQL (asyncpg)
async def add_player(pool, player_id: int, name: str, level: int, experience: int):
    """Add a player to PostgreSQL.

    Args:
        pool: The connection pool.
        player_id (int): The player ID.
        name (str): The player name.
        level (int): The player's level.
        experience (int): The player's experience.
    """
    player_data = {
        'player_id': player_id,
        'name': name,
        'level': level,
        'experience': experience
    }
    validate_schema(SCHEMA['player'], player_data)
    query = """
        INSERT INTO players (player_id, name, level, experience)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (player_id) DO UPDATE
        SET name = EXCLUDED.name,
            level = EXCLUDED.level,
            experience = EXCLUDED.experience;
    """
    async with pool.acquire() as conn:
        await conn.execute(query, player_id, name, level, experience)

async def get_player(pool, player_id: int) -> Dict[str, Any]:
    """Retrieve player data from PostgreSQL.

    Args:
        pool: The connection pool.
        player_id (int): The ID of the player to retrieve.

    Returns:
        dict: The player data.
    """
    query = "SELECT * FROM players WHERE player_id = $1;"
    async with pool.acquire() as conn:
        result = await conn.fetchrow(query, player_id)
    if result:
        return dict(result)
    return {}

# Game operations using Redis
def add_game(game_id: int, name: str, max_players: int):
    """Add a game to Redis.

    Args:
        game_id (int): The game ID.
        name (str): The game name.
        max_players (int): The maximum number of players.
    """
    game_data = {
        'game_id': game_id,
        'name': name,
        'max_players': max_players
    }
    validate_schema(SCHEMA['game'], game_data)
    r.hset(f"game:{game_id}", mapping=game_data)

def game_exists(game_id: int) -> bool:
    """
    Check if a game exists.
    :param game_id:
    :return:
    """
    return r.hexists(f"game:{game_id}")


def get_game(game_id: int) -> Dict[str, Any]:
    """Retrieve game data from Redis.

    Args:
        game_id (int): The ID of the game to retrieve.

    Returns:
        dict: The game data.
    """
    return r.hgetall(f"game:{game_id}")

# Session operations using Redis
def add_session(session_id: int, game_id: int, players: List[int]):
    """Add a session to Redis.

    Args:
        session_id (int): The session ID.
        game_id (int): The game ID associated with the session.
        players (list): List of player IDs participating in the session.
    """
    session_data = {
        'session_id': session_id,
        'game_id': game_id,
        'players': players
    }
    validate_schema(SCHEMA['session'], session_data)
    r.hset(f"session:{session_id}", mapping=session_data)

def get_session(session_id: int) -> Dict[str, Any]:
    """Retrieve session data from Redis.

    Args:
        session_id (int): The ID of the session to retrieve.

    Returns:
        dict: The session data.
    """
    return r.hgetall(f"session:{session_id}")

# Score operations using Redis
def add_score(player_id: int, game_id: int, score: int):
    """Add a score to Redis.

    Args:
        player_id (int): The ID of the player.
        game_id (int): The ID of the game.
        score (int): The score achieved by the player.
    """
    score_data = {
        'player_id': player_id,
        'game_id': game_id,
        'score': score
    }
    validate_schema(SCHEMA['score'], score_data)
    r.hset(f"score:{player_id}:{game_id}", mapping=score_data)

def get_score(player_id: int, game_id: int) -> Dict[str, Any]:
    """Retrieve score data from Redis.

    Args:
        player_id (int): The ID of the player whose score to retrieve.
        game_id (int): The ID of the game whose score to retrieve.

    Returns:
        dict: The score data.
    """
    return r.hgetall(f"score:{player_id}:{game_id}")

def get_all_scores_for_game(game_id: int) -> List[Dict[str, Any]]:
    """Retrieve all players' scores for a specific game from Redis.

    Args:
        game_id (int): The ID of the game to retrieve scores for.

    Returns:
        list: A list of dictionaries containing player scores.
    """
    keys = r.keys(f"score:*:{game_id}")
    scores = []
    for key in keys:
        scores.append(r.hgetall(key))
    return scores

async def close_connections(pool):
    """Close the PostgreSQL connection pool."""
    await pool.close()