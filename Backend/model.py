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


# Todo Models Start


class Todo(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    category: Optional[str]
    title: str
    description: Optional[str]
    completion: bool
    create_date: str
    due_date: Optional[str]

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "category": "Business",
                "title": "My Title",
                "description": "This is a description",
                "completion": "True",
                "create_date": "2008-09-15",
                "due_date": "2008-09-15",
            }
        }


class UpdateTodoModel(BaseModel):
    category: Optional[str]
    title: Optional[str]
    description: Optional[str]
    completion: Optional[bool]
    create_date: Optional[str]
    due_date: Optional[str]

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "category": "Business",
                "title": "My Title",
                "description": "This is a description",
                "completion": "True",
                "create_date": "2008-09-15",
                "due_date": "2008-09-15",
            }
        }


# Todo Models End

# Category Models Start


class Category(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str
    description: Optional[str]
    create_date: str

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "title": "My Title",
                "description": "This is a description",
                "create_date": "2008-09-15",
            }
        }


class UpdateCategoryModel(BaseModel):
    title: Optional[str]
    description: Optional[str]
    create_date: Optional[str]

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "title": "My Title",
                "description": "This is a description",
                "create_date": "2008-09-15",
            }
        }
