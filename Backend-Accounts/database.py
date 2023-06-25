db = {
    "tim": {
        "username": "tim",
        "full_name": "Tim Ruscica",
        "email": "tim@gmail.com",
        "hashed_password": "$2b$12$9TObvxeCGi4Mo1X2Z0ejDuowhv/LG90pIWR6MuaQJEC8wf0yH1K0S",
        "disabled": False,
    }
}

# # Todo DB Calls Start
# async def fetch_all_todos():
#     todos = []
#     cursor = collection.find({})
#     async for document in cursor:
#         todos.append(Todo(**document))
#     return todos


# async def create_todo(todo):
#     document = todo
#     result = await collection.insert_one(document)
#     return document


# async def fetch_one_todo(id):
#     todo = await collection.find_one({"_id": id})
#     if todo is not None:
#         return todo


# async def update_todo(id, todo):
#     update_result = await collection.update_one({"_id": id}, {"$set": todo})
#     if update_result.modified_count == 1:
#         updated_todo = await collection.find_one({"_id": id})
#         if updated_todo is not None:
#             return updated_todo
#     existing_todo = await collection.find_one({"_id": id})
#     if existing_todo is not None:
#         return existing_todo


# async def remove_todo(id):
#     await collection.delete_one({"_id": id})
#     return True
# # Todo DB Calls End
