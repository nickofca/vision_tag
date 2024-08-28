from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from typing import Union
import os
import boto3


# Fetch AWS credentials from environment variables
aws_access_key_id = os.environ.get('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
aws_region = os.environ.get('AWS_REGION')
secret_hash_key = os.environ.get('HASH_KEY') # TODO: Move to secrets


# Initialize a session using environment variables
dynamodb = boto3.resource(
    'dynamodb',
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    region_name=aws_region
)

# Select your DynamoDB table
users_table = dynamodb.Table('users')


# Example user storage (in memory for simplicity)
revoked_tokens = set()  # TODO: Set up table in redis


def register_user(player_id, password, email):
    # Check if the user already exists
    response = users_table.get_item(
        Key={'username': player_id}
    )

    if 'Item' in response:
        raise Exception('User already exists')

    # Hash the password
    hashed_password = generate_password_hash(password)

    # Register the new user in the DynamoDB table
    users_table.put_item(
        Item={
            'username': player_id,
            'password': hashed_password,
            'email': email
        }
    )


def authenticate_user(player_id, password):
    # Fetch the user data from the DynamoDB table
    response = users_table.get_item(
        Key={'username': player_id}
    )

    # Check if the user exists
    if 'Item' not in response:
        return None  # User not found

    # Retrieve the hashed password from the stored item
    hashed_password = response['Item'].get('password')

    # Check if the provided password matches the hashed password
    if check_password_hash(hashed_password, password):
        return player_id  # Authentication successful


def generate_token(player_id):
    payload = {
        'player_id': player_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token expires in 1 hour
    }
    token = jwt.encode(payload, secret_hash_key, algorithm='HS256')
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
        payload = jwt.decode(token, secret_hash_key, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    return payload['player_id']


def logout(token):
    revoked_tokens.add(token)
    return "Logged out successfully"
