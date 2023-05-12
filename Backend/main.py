from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from model import Todo

# App object
app = FastAPI()


from database import (
    fetch_all_todos,
    fetch_one_todo,
    create_todo,
    update_todo,
    remove_todo,
)

# Set up a settings.py file later to import these settings?
# Consider creating one for routes as well?
origins = ['http://localhost:3000', 'http://localhost:5173']

app.add_middleware(
    CORSMiddleware,
    allow_origins= origins,
    allow_credentials= True,
    allow_methods= ["*"],
    allow_headers= ["*"],
)

# @app.get("/")
# async def read_root():
#     return {"message": "Hello World"}

@app.get("/api/todo")
async def get_todos():
    response = await fetch_all_todos()
    return response

@app.get("/api/todo/{title}", response_model=Todo)
async def get_todo_by_id(title):
    response = await fetch_one_todo(title)
    if response:
        return response
    raise HTTPException(404, f"There is no TODO item with this title: {title}")

@app.post("/api/todo", response_model=Todo)
async def post_todo(todo:Todo):
    response = await create_todo(todo.dict())
    if response:
        return response
    raise HTTPException(400,"Something went wrong / Bad Request")

@app.put("/api/todo/{title}", response_model=Todo)
async def put_todo(title:str, description:str):
    response = await update_todo(title, description)
    if response:
        return response
    raise HTTPException(404, f"There is no TODO item with this title {title}")

@app.delete("/api/todo/{title}")
async def delete_todo(title):
    response = await remove_todo(title)
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
