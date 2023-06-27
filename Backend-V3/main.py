from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# In-memory database (replace with a real database in production)
users_db = {
    "Bladeburner01": {"username": "Bladeburner01", "password": "Blade001!"},
    "Bladeburner02": {"username": "Bladeburner02", "password": "Blade002!"},
    "Bladeburner03": {"username": "Bladeburner03", "password": "Blade003!"},
}


class User(BaseModel):
    username: str
    password: str


class UserInDB(User):
    hashed_password: str


def get_user(username: str):
    if username in users_db:
        user_dict = users_db[username]
        return UserInDB(**user_dict)


def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user or user.password != password:
        return False
    return user


# Register = CREATE
@app.post("/register")
def register(user: User):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_password = (
        user.password
    )  # In a real application, you would hash the password
    user_dict = user.dict()
    user_dict["hashed_password"] = hashed_password
    users_db[user.username] = user_dict
    print(users_db)
    return {"message": "Registration successful"}


@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # In a real application, you would generate and return an access token here
    return {"message": "Login successful"}


@app.get("/protected")
def protected_route(token: str = Depends(oauth2_scheme)):
    # In a real application, you would validate the access token here
    print(token)
    return {"message": "Access granted"}


# if __name__ == "__main__":
#     import uvicorn

#     uvicorn.run(app, host="0.0.0.0", port=8000)
