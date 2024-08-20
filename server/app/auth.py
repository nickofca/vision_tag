from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from typing import Union


SECRET_KEY = 'your_secret_key'  # TODO: Move to secrets

# Example user storage (in memory for simplicity)
users_db = {"a": "scrypt:32768:8:1$W9fCt62PWxsB8Hna$f9e7175db76a6ddd563ab9625c2a263811d162e0d56579362be3727755cd3b305bb85f1a48d9ab0f6f89ecd85ccd956f1d4e1b6f9d97eec2531854f34fee5e60"}   # TODO: Set up table in PostgreSQL
revoked_tokens = set()  # TODO: Set up table in redis


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


security = HTTPBearer()
async def token_required(token: HTTPAuthorizationCredentials = Depends(security)):
    if not token.credentials:
        raise HTTPException(status_code=401, detail="Token is missing")
    elif token.credentials in revoked_tokens:
        raise HTTPException(status_code=401, detail="Token is revoked")

    return decode_token(token.credentials)


def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    return payload['player_id']


def logout(token):
    revoked_tokens.add(token)
    return "Logged out successfully"
