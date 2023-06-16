

look into bringing fetch calls into server.ts and class typing various models


continue for auth >> https://www.youtube.com/watch?v=5GxQ1rLTwaU
```
pip install fastapi uvicorn python-multipart python-jose[cryptography] passlib[bcrypt]
```
5:00

in main.py:
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
