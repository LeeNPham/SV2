from database import (
    fetch_all_todos,
    fetch_one_todo,
    create_todo,
    update_todo,
    remove_todo,
    upload_to_db,
    get_file_from_db,
)
from fastapi import FastAPI, HTTPException, Body, UploadFile, File
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from model import Todo, UpdateTodoModel


app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload-photo", tags=["Uploads"])
async def upload_photo(photo: UploadFile = File(...)):
    photo_data = await photo.read()
    response = await upload_to_db(photo, photo_data)
    return {
        "message": "Photo uploaded successfully",
        "file_id": str(response.inserted_id),
    }


@app.get("/files/{file_id}", tags=["Uploads"])
async def get_file(file_id: str):
    response = await get_file_from_db(file_id)
    if response:
        return response
    raise HTTPException(status_code=404, detail="File not found")


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
