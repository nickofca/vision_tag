from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash


SECRET_KEY = 'your_secret_key'  # TODO: Move to secrets

# Example user storage (in memory for simplicity)
users_db = {}   # TODO: Set up table in PostgreSQL
revoked_tokens = set()  # TODO: Set up table in redis
security = HTTPBearer()


def register_user(player_id, password):
    if player_id in users_db:
        return 'User already exists'
    hashed_password = generate_password_hash(password)
    users_db[player_id] = hashed_password
    return 'User registered successfully'


def authenticate_user(player_id, password):
    if player_id not in users_db:
        return None
    hashed_password = users_db[player_id]
    if check_password_hash(hashed_password, password):
        return player_id  # Authentication successful
    return None  # Authentication failed


def generate_token(player_id):
    payload = {
        'player_id': player_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token expires in 1 hour
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token


async def token_required(token: HTTPAuthorizationCredentials = Depends(security)):
    if not token.credentials:
        raise HTTPException(status_code=401, detail="Token is missing")
    elif token.credentials in revoked_tokens:
        raise HTTPException(status_code=401, detail="Token is revoked")

    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    return payload['player_id']


def logout(token):
    revoked_tokens.add(token)
    return "Logged out successfully"
