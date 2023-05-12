from model import Todo
import motor.motor_asyncio  # MongoDB Driver


client = motor.motor_asyncio.AsyncIOMotorClient(
    'mongodb://localhost:27017')  # helps to connect with mongodb compass
database = client.TodoList  # name of database
collection = database.todo  # same thing as a table in SQL


async def fetch_all_todos():
    todos = []
    # find-MongoDB function
    cursor = collection.find({})
    async for document in cursor:
        todos.append(Todo(**document))
    return todos


async def fetch_one_todo(title):
    # find_one-MongoDB function
    document = await collection.find_one({"title": title})
    return document


async def create_todo(todo):
    document = todo
    # insert_one-MongoDB function
    result = await collection.insert_one(document)
    return document


async def update_todo(title, description):
    # update_one-MongoDB function
    await collection.update_one({"title": title}, {"$set": {
        "description": description}})
    document = await collection.find_one({"title": title})
    return document


async def remove_todo(title):
    # delete_one-MongoDB function
    await collection.delete_one({"title": title})
    return True
