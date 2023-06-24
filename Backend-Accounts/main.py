# Start
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

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
