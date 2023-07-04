import motor.motor_asyncio  # MongoDB Driver
from bson.objectid import ObjectId
import os
from fastapi.responses import StreamingResponse
from io import BytesIO
from dotenv import load_dotenv

load_dotenv()
api_key = os.environ.get("CLUSTER_PASSWORD")

client = motor.motor_asyncio.AsyncIOMotorClient(api_key)
database = client.UploadsList
collection = database.upload


async def upload_to_db(photo, photo_data):
    content_type = photo.content_type
    document = {
        "filename": photo.filename,
        "content_type": content_type,
        "data": photo_data,
    }
    result = await collection.insert_one(document)
    return result


async def get_file_from_db(file_id):
    document = await collection.find_one({"_id": ObjectId(file_id)})
    if document:
        file_data = document["data"]
        headers = {"Content-Type": document["content_type"]}
        return StreamingResponse(BytesIO(file_data), headers=headers)


async def download_file_from_db(file_id):
    document = await collection.find_one({"_id": ObjectId(file_id)})
    if document:
        file_data = document["data"]
        headers = {
            "Content-Disposition": f'attachment; filename="{document["filename"]}"'
        }
        return StreamingResponse(BytesIO(file_data), headers=headers)
