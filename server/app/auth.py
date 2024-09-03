from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import json
import boto3

def retrieve_secret_hash_key(session):
    # Create a Secrets Manager client
    client = session.client('secretsmanager')

    # Retrieve the secret
    response = client.get_secret_value(SecretId="TokenEncryptionKey")

    # Parse the secret
    return json.loads(response['SecretString'])["HASH_KEY"]


def retrieve_user_table(session):
    # Initialize DynamoDB resource
    dynamodb = session.resource('dynamodb')

    # Specify the DynamoDB table
    return dynamodb.Table('users')

# Create a session with available IAM
session = boto3.Session(region_name='us-east-1')   # Developers sign into IAM with AWS CLI
secret_hash_key = retrieve_secret_hash_key(session)
users_table = retrieve_user_table(session)


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
