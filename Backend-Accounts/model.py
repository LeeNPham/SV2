# from typing import Optional
from pydantic import BaseModel, Field
from bson.objectid import ObjectId
from typing import Optional
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str or None = None


class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    username: str
    email: str or None = None
    full_name: str or None = None
    disabled: bool or None = None


class UserInDB(User):
    hashed_password: str


# class Todo(BaseModel):
#     id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
#     category: Optional[str]
#     title: str
#     description: Optional[str]
#     completion: bool
#     create_date: str
#     due_date: Optional[str]

#     class Config:
#         allow_population_by_field_name = True
#         arbitrary_types_allowed = True
#         json_encoders = {ObjectId: str}
#         schema_extra = {
#             "example": {
#                 "category": "Business",
#                 "title": "My Title",
#                 "description": "This is a description",
#                 "completion": "True",
#                 "create_date": "2008-09-15",
#                 "due_date": '2008-09-15'
#             }
#         }


# class UpdateTodoModel(BaseModel):
#     category: Optional[str]
#     title: Optional[str]
#     description: Optional[str]
#     completion:  Optional[bool]
#     create_date: Optional[str]
#     due_date: Optional[str]

#     class Config:
#         arbitrary_types_allowed = True
#         json_encoders = {ObjectId: str}
#         schema_extra = {
#             "example": {
#                 "category": "Business",
#                 "title": "My Title",
#                 "description": "This is a description",
#                 "completion": "True",
#                 "create_date": "2008-09-15",
#                 "due_date": '2008-09-15'
#             }
#         }
# # Todo Models End
