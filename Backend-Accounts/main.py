# Start
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

# class architecture
from pydantic import BaseModel

# time and time changes
from datetime import datetime, timedelta

# jwt encoding
from jose import JWTError, jwt

# context for hashing passwords in library
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

# look into query parameters, we can instantiate it in the function as an optional query by giving it a default value,
# or requiring it by not giving it a value and only giving it a type

# in terminal
# openssl rand -hex 32
# creates a 32 bit encryption key
secret_key = os.environ.get("SECRET_KEY")
algorithm = os.environ.get("ALGORITHM")
access_token_expire_minutes = os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES")


fake_db = {
    "tim": {
        "username": "tim",
        "full_name": "Tim Ruscica",
        "email": "tim@gmail.com",
        "hashed_password": "",
        "disabled": False,
    }
}


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str or None = None

class User(BaseModel):
    username: str
    email: str or None = None
    full_name: str or None = None
    disabled: bool or None = None

class UserInDB(User):
    hashed_password: str

# This is going to define where we go to retrieve our access token
# Allows us to verify password after hashing, and to has a password provided by the user
pwd_context= CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth_2_scheme = OAuth2PasswordBearer(tokenUrl='token')

# Utility functions to authenticate our users and hash their passwords
#   hashing means to perform encryption on the password so we aren't storing it as plain text
#       this allows us to store and authenticate the users password without ever knowing or storing it
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# This will initialize our model which comes from UserInDB, which inherits from User, which inherits from BaseModel
#   by passing in all of the keyword arguments we got from our user_data dictionary
#       (creates an object based on the keyword provided for all subkey/subvalue pairs)
def get_user(db, username:str):
    if username in db:
        user_data = db[username]
        return UserInDB(**user_data)

def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

app = FastAPI()
















































# original reference
# from database import (
#     fetch_all_todos,
#     fetch_one_todo,
#     create_todo,
#     update_todo,
#     remove_todo,

# )
# from fastapi import FastAPI, HTTPException, Body
# from fastapi.encoders import jsonable_encoder
# from fastapi.middleware.cors import CORSMiddleware
# from datetime import datetime
# from model import Todo, UpdateTodoModel

# # App object
# app = FastAPI()


# # Set up a settings.py file later to import these settings?
# origins = ['*']

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# @app.get("/")
# async def read_root():
#     response = {"hello": "world"}
#     return response

# # Todos Start


# @app.get("/api/todo")
# async def get_todos():
#     response = await fetch_all_todos()
#     return response


# @app.post("/api/todo", response_description="Add a new todo", response_model=Todo)
# async def post_todo(todo: Todo = Body(...)):
#     todo = jsonable_encoder(todo)
#     response = await create_todo(todo)
#     if response:
#         return response
#     raise HTTPException(400, "Something went wrong / Bad Request")


# @app.get("/api/todo/{id}", response_description="Get a single todo", response_model=Todo)
# async def get_todo_by_id(id: str):
#     response = await fetch_one_todo(id)
#     if response:
#         return response
#     raise HTTPException(404, f"ID {id} not found")


# @app.put("/api/todo/{id}", response_description="Update a todo", response_model=Todo)
# async def put_todo(id: str, todo: UpdateTodoModel = Body(...)):
#     todo = {k: v for k, v in todo.dict().items() if v is not None}
#     if len(todo) >= 1:
#         response = await update_todo(id, todo)
#     if response:
#         return response
#     raise HTTPException(404, f"There is no TODO item with this title {id}")


# @app.delete("/api/todo/{id}", response_description="Delete a todo")
# async def delete_todo(id: str):
#     response = await remove_todo(id)
#     if response:
#         return "Successfully deleted todo item"
#     raise HTTPException(404, f"There is no TODO item with this id:{id}")
# # Todos End
