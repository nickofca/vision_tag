from pydantic import BaseModel, EmailStr

class UserLogin(BaseModel):
    username: str
    password: str

class UserCreate(UserLogin):
    email: EmailStr

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
