from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from model import User, UserInDB, Token, TokenData
import os
from dotenv import load_dotenv
from database import db
from utils import (
    verify_password,
    get_password_hash,
    get_user,
    authenticate_user,
    create_access_token,
    get_current_user,
    get_current_active_user,
)

load_dotenv()

secret_key = os.environ.get("SECRET_KEY")
algorithm = os.environ.get("ALGORITHM")
access_token_expire_minutes = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth_2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()


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
