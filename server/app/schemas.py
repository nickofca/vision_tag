from pydantic import BaseModel, EmailStr
from typing import Dict

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    type: str
    status: int
    payload: dict

    class Config:
        orm_mode = True
        extra = "allow"

class Player(BaseModel):
    player_id: str
    score: int = 0
