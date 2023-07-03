from database import (
    fetch_all_todos,
    fetch_one_todo,
    create_todo,
    update_todo,
    remove_todo,
    fetch_all_categories,
    fetch_one_category,
    create_category,
    update_category,
    remove_category,
)
from fastapi import FastAPI, HTTPException, Body
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from model import Todo, UpdateTodoModel, Category, UpdateCategoryModel

# App object
app = FastAPI()


# Set up a settings.py file later to import these settings?
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Todos Start


@app.get("/api/todo", tags=["Todos"])
async def get_todos():
    response = await fetch_all_todos()
    return response


@app.post(
    "/api/todo",
    response_description="Add a new todo",
    response_model=Todo,
    tags=["Todos"],
)
async def post_todo(todo: Todo = Body(...)):
    todo = jsonable_encoder(todo)
    response = await create_todo(todo)
    if response:
        return response
    raise HTTPException(400, "Something went wrong / Bad Request")


@app.get(
    "/api/todo/{id}",
    response_description="Get a single todo",
    response_model=Todo,
    tags=["Todos"],
)
async def get_todo_by_id(id: str):
    response = await fetch_one_todo(id)
    if response:
        return response
    raise HTTPException(404, f"ID {id} not found")


@app.put(
    "/api/todo/{id}",
    response_description="Update a todo",
    response_model=Todo,
    tags=["Todos"],
)
async def put_todo(id: str, todo: UpdateTodoModel = Body(...)):
    todo = {k: v for k, v in todo.dict().items() if v is not None}
    if len(todo) >= 1:
        response = await update_todo(id, todo)
    if response:
        return response
    raise HTTPException(404, f"There is no TODO item with this title {id}")


@app.delete("/api/todo/{id}", response_description="Delete a todo", tags=["Todos"])
async def delete_todo(id: str):
    response = await remove_todo(id)
    if response:
        return "Successfully deleted todo item"
    raise HTTPException(404, f"There is no TODO item with this id:{id}")


# Todos End

# Categories Start


@app.get("/api/category", tags=["Categories"])
async def get_categories():
    response = await fetch_all_categories()
    return response


@app.post(
    "/api/category",
    response_description="Add a new category",
    response_model=Category,
    tags=["Categories"],
)
async def post_category(category: Category = Body(...)):
    category = jsonable_encoder(category)
    response = await create_category(category)
    if response:
        return response
    raise HTTPException(400, "Something went wrong / Bad Request")


@app.get(
    "/api/category/{id}",
    response_description="Get a single category",
    response_model=Category,
    tags=["Categories"],
)
async def get_category_by_id(id: str):
    response = await fetch_one_category(id)
    if response:
        return response
    raise HTTPException(404, f"ID {id} not found")


@app.put(
    "/api/category/{id}",
    response_description="Update a category",
    response_model=Category,
    tags=["Categories"],
)
async def put_category(id: str, category: UpdateCategoryModel = Body(...)):
    category = {k: v for k, v in category.dict().items() if v is not None}
    if len(category) >= 1:
        response = await update_category(id, category)
    if response:
        return response
    raise HTTPException(404, f"There is no TODO item with this title {id}")


@app.delete(
    "/api/category/{id}", response_description="Delete a category", tags=["Categories"]
)
async def delete_category(id: str):
    response = await remove_category(id)
    if response:
        return "Successfully deleted todo item"
    raise HTTPException(404, f"There is no TODO item with this id:{id}")


# Categories End
