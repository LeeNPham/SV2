BackendAUTH

continue for auth >> https://www.youtube.com/watch?v=5GxQ1rLTwaU
```
# runtime: python 3.9

pip install fastapi uvicorn python-multipart python-jose[cryptography] passlib[bcrypt]

# fastAPI - framework for creating a fastAPI classed app
# uvicorn[standard] - ASGI (webserver to display and host our web service)
# python-multipart - used for decoding json data, used internally by fastAPI
# python-jose[cryptography] - used to do some password hashing and jwt related decoding hashing
# passlib[decrypt] - used for password hashing
```
5:00

in main.py:
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
