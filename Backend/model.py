# from typing import Optional
from pydantic import BaseModel, Field
from bson.objectid import ObjectId
from typing import List, Optional
import datetime
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


class Todo(BaseModel):
    # id:  ObjectId = Field(..., alias="_id")
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str
    description: str
    completion: bool
    create_date: str
    due_date: Optional[str]

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "title": "My Title",
                "description": "This is a description",
                "completion": "True",
                "create_date": "2008-09-15",
                "due_date": '2008-09-15'
            }
        }


class UpdateTodoModel(BaseModel):
    title: str
    description: str
    completion: bool
    create_date: str
    due_date: Optional[str]

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "title": "My Title",
                "description": "This is a description",
                "completion": "True",
                "create_date": "2008-09-15",
                "due_date": '2008-09-15'
            }
        }

        # class Config:
        #     allow_population_by_field_name = True
        #     arbitrary_types_allowed = True
        #     json_encoders = {ObjectId: str}

    # class Item(BaseModel):
    #     name: str
    #     description: Optional[str] = None
    #     price: float
    #     tax: Optional[float] = None

    # class User(BaseModel):
    #     name: str
    #     description: Optional[str] = None
    #     email: str
    #     password: str
