from model import Todo, UpdateTodoModel
import motor.motor_asyncio  # MongoDB Driver
from bson.objectid import ObjectId


client = motor.motor_asyncio.AsyncIOMotorClient(
    'mongodb://localhost:27017')  # helps to connect with mongodb compass
database = client.TodoList  # name of database
collection = database.todo  # same thing as a table in SQL


async def fetch_all_todos():
    todos = []
    cursor = collection.find({})
    async for document in cursor:
        todos.append(Todo(**document))
    return todos


async def fetch_one_todo(id):
    document = await collection.find_one({"_id": id})
    return document


async def create_todo(todo):
    document = todo
    result = await collection.insert_one(document)
    return document


async def update_todo(id, title, description, completion, create_date, due_date):
    await collection.update_one({"_id": id}, {"$set": {
        "title": title,
        "description": description,
        "completion": completion,
        "create_date": create_date,
        "due_date": due_date

    }})
    document = await collection.find_one({"id": id})
    return document


async def remove_todo(id):
    # delete_one-MongoDB function
    await collection.delete_one({"id": id})
    return True
