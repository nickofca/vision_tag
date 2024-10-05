from pydantic import BaseModel, EmailStr

class UserLogin(BaseModel):
    username: str
    password: str

class UserCreate(UserLogin):
    email: EmailStr

class UserMessage(BaseModel):
    type: str
    payload: dict

class UserResponse(UserMessage):
    status: int

class Player(BaseModel):
    player_id: str
    score: int = 0
