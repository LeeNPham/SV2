from model import Todo, UpdateTodoModel, Category, UpdateCategoryModel
import motor.motor_asyncio  # MongoDB Driver
from bson.objectid import ObjectId
import os
from dotenv import load_dotenv
load_dotenv()
api_key = os.environ.get('CLUSTER_PASSWORD')
print(api_key)


client = motor.motor_asyncio.AsyncIOMotorClient(
    f'mongodb+srv://LeeNPham:{api_key}@cluster0.jizibqp.mongodb.net/test')  # helps to connect with mongodb compass
database = client.TodoList  # name of database
collection = database.todo  # same thing as a table in SQL
category_collection = database.category

# Todo DB Calls Start


async def fetch_all_todos():
    todos = []
    cursor = collection.find({})
    async for document in cursor:
        todos.append(Todo(**document))
    return todos


async def create_todo(todo):
    document = todo
    result = await collection.insert_one(document)
    return document


async def fetch_one_todo(id):
    if (todo := await collection.find_one({"_id": id})) is not None:
        return todo


async def update_todo(id, todo):
    update_result = await collection.update_one({"_id": id}, {"$set": todo})
    if update_result.modified_count == 1:
        if (
            updated_todo := await collection.find_one({"_id": id})
        ) is not None:
            return updated_todo
    if (existing_todo := await collection.find_one({"_id": id})) is not None:
        return existing_todo


async def remove_todo(id):
    await collection.delete_one({"_id": id})
    return True
# Todo DB Calls End

# Category DB Calls Start


async def fetch_all_categories():
    categories = []
    cursor = category_collection.find({})
    async for document in cursor:
        categories.append(Category(**document))
    return categories


async def create_category(category):
    document = category
    result = await category_collection.insert_one(document)
    return document


async def fetch_one_category(id):
    if (category := await category_collection.find_one({"_id": id})) is not None:
        return category


async def update_category(id, category):
    update_result = await category_collection.update_one({"_id": id}, {"$set": category})
    if update_result.modified_count == 1:
        if (
            updated_category := await category_collection.find_one({"_id": id})
        ) is not None:
            return updated_category
    if (existing_category := await category_collection.find_one({"_id": id})) is not None:
        return existing_category


async def remove_category(id):
    await category_collection.delete_one({"_id": id})
    return True
