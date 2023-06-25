from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from model import User, UserInDB, Token, TokenData
import os
from dotenv import load_dotenv

load_dotenv()

secret_key = os.environ.get("SECRET_KEY")
algorithm = os.environ.get("ALGORITHM")
access_token_expire_minutes = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES"))

db = {
    "tim": {
        "username": "tim",
        "full_name": "Tim Ruscica",
        "email": "tim@gmail.com",
        "hashed_password": "$2b$12$9TObvxeCGi4Mo1X2Z0ejDuowhv/LG90pIWR6MuaQJEC8wf0yH1K0S",
        "disabled": False,
    }
}

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth_2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_user(db, username: str):
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


def create_access_token(data: dict, expires_delta: timedelta or None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm=algorithm)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth_2_scheme)):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, secret_key, algorithms=[algorithm])
        username: str = payload.get("sub")
        if username is None:
            raise credential_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credential_exception
    user = get_user(db, username=token_data.username)
    if user is None:
        raise credential_exception
    return user


async def get_current_active_user(current_user: UserInDB = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


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
