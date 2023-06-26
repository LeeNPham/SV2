db = {
    "tim": {
        "username": "tim",
        "email": "tim@gmail.com",
        "full_name": "Tim Ruscica",
        "disabled": "false",
        "_id": "6498df1ae1d6dcaa38ea0f28",
        "hashed_password": "$2b$12$9TObvxeCGi4Mo1X2Z0ejDuowhv/LG90pIWR6MuaQJEC8wf0yH1K0S",
    }
}

from model import User
import motor.motor_asyncio  # MongoDB Driver
from bson.objectid import ObjectId
import os
from dotenv import load_dotenv
from utils import get_password_hash

load_dotenv()
api_key = os.environ.get("CLUSTER_PASSWORD")
client = motor.motor_asyncio.AsyncIOMotorClient(api_key)
database = client.AccountsList

collection = database.account


# User DB Calls Start
async def fetch_all_accounts():
    users = []
    cursor = collection.find({})
    async for document in cursor:
        users.append(User(**document))
    return users


async def create_account(user):
    user["hashed_password"] = get_password_hash(user["hashed_password"])
    document = user
    result = await collection.insert_one(document)

    return document


async def fetch_one_account(id):
    user = await collection.find_one({"_id": id})
    if user is not None:
        return user


async def update_account(id, user):
    update_result = await collection.update_one({"_id": id}, {"$set": user})
    if update_result.modified_count == 1:
        updated_user = await collection.find_one({"_id": id})
        if updated_user is not None:
            return updated_user
    existing_user = await collection.find_one({"_id": id})
    if existing_user is not None:
        return existing_user


async def remove_account(id):
    await collection.delete_one({"_id": id})
    return True


# User DB Calls End
