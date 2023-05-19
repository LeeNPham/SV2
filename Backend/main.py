from database import (
    fetch_all_todos,
    fetch_one_todo,
    create_todo,
    update_todo,
    remove_todo,
)
from fastapi import FastAPI, HTTPException, Body
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from model import Todo

# App object
app = FastAPI()


# Set up a settings.py file later to import these settings?
# Consider creating one for routes as well?
origins = ['http://localhost:3000', 'http://localhost:5173']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.get("/")
# async def read_root():
#     return {"message": "Hello World"}


@app.get("/api/todo")
async def get_todos():
    response = await fetch_all_todos()
    return response


@app.get("/api/todo/{id}", response_description="Get a single todo", response_model=Todo)
async def get_todo_by_id(id: str):
    response = await fetch_one_todo(id)
    if response is not None:
        return response
    raise HTTPException(404, f"ID {id} not found")


@app.post("/api/todo", response_description="Add a new todo", response_model=Todo)
async def post_todo(todo: Todo = Body(...)):
    response = await create_todo(todo.dict())
    if response:
        print(response)
        return response
    raise HTTPException(400, "Something went wrong / Bad Request")


@app.put("/api/todo/{id}", response_model=Todo)
async def put_todo(id: str, title: str, description: str, completion: bool, create_date: str, due_date: str):
    response = await update_todo(id, title, description, completion, create_date, due_date)
    if response:
        return response
    raise HTTPException(404, f"There is no TODO item with this title {title}")


@app.delete("/api/todo/{id}")
async def delete_todo(id: str, title: str):
    response = await remove_todo(id)
    if response:
        return "Successfully deleted todo item"
    raise HTTPException(404, f"There is no TODO item with this title {title}")


# ########################
# @app.get("/users/me")
# async def read_user_me():
#     return {"user_id": "the current user"}

# @app.post("/items/")
# async def create_item(item: Item):
#     item_dict = item.dict()
#     if item.tax:
#         price_with_tax = item.price + item.tax
#         item_dict.update({"price_with_tax": price_with_tax})
#     return item_dict

# @app.put("/items/{item_id}")
# async def create_item(item_id: int, item: Item):
#     return {"item_id": item_id, **item.dict()}
# ########################

# @app.post("/users/")
# async def create_user(user_id: str):
#     return {"user_id": user_id}


# @app.get("/users/{user_id}")
# async def read_user(user_id: str, user: User):
#     return {"user_id": user_id,
#             "user_name": user.name
#             }


# @app.put("/users/{user_id}")
# async def update_user(user_id: str, user: User):
#     return {"user_id": user_id, **user.dict()}


# @app.delete("/users/{user_id}")
# async def delete_user(user_id: str):
#     return {"user_id": user_id}
