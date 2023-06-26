from fastapi import Depends, FastAPI, HTTPException, status, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
from fastapi.encoders import jsonable_encoder
from passlib.context import CryptContext
from model import User, UserInDB, Token, UpdateUserModel
from database import (
    db,
    fetch_all_accounts,
    fetch_one_account,
    create_account,
    update_account,
    remove_account,
)
import os
from dotenv import load_dotenv

from utils import (
    authenticate_user,
    create_access_token,
    get_current_active_user,
)

load_dotenv()
access_token_expire_minutes = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES"))
app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Tokens
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=access_token_expire_minutes)
    print(f"access token expires in {access_token_expires}")
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# Account Verification
@app.get("/accounts/profile/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@app.get("/accounts/profile/items")
async def read_own_items(current_user: User = Depends(get_current_active_user)):
    return [
        {
            "todos": [
                {"todo_id": 1, "title": "playlist1", "owner": current_user},
                {"todo_id": 2, "title": "playlist2", "owner": current_user},
                {"todo_id": 3, "title": "playlist3", "owner": current_user},
            ]
        },
        {
            "categories": [
                {"category_id": 1, "title": "category1", "owner": current_user},
                {"category_id": 2, "title": "category2", "owner": current_user},
                {"category_id": 3, "title": "category3", "owner": current_user},
            ]
        },
    ]


# Account CRUD


@app.post(
    "/accounts", response_description="Add a new account", response_model=UserInDB
)
async def post_account(user: UserInDB = Body(...)):
    user = jsonable_encoder(user)
    response = await create_account(user)
    if response:
        return response
    raise HTTPException(400, "Something went wrong / Bad Request")


@app.get("/accounts")
async def get_accounts():
    response = await fetch_all_accounts()
    return response


@app.get(
    "/accounts/{id}",
    response_description="Get a single account",
    response_model=UserInDB,
)
async def get_account_by_id(id: str):
    response = await fetch_one_account(id)
    if response:
        return response
    raise HTTPException(404, f"ID {id} not found")


@app.put(
    "/accounts/{id}", response_description="Update an account", response_model=User
)
async def put_account(id: str, user: UpdateUserModel = Body(...)):
    user = {k: v for k, v in user.dict().items() if v is not None}
    if len(user) >= 1:
        response = await update_account(id, user)
    if response:
        return response
    raise HTTPException(404, f"There is no user account with this {id}")


@app.delete("/accounts/{id}", response_description="Delete a user account")
async def delete_account(id: str):
    response = await remove_account(id)
    if response:
        return "Successfully deleted user account"
    raise HTTPException(404, f"There is no user account with this id:{id}")
