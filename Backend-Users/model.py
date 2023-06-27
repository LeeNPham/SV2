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


class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    username: Optional[str] = None
    email: Optional[str] = None
    disabled: Optional[bool] = False
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    description: Optional[str] = None
    todos: Optional[list] = None
    categories: Optional[list] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "username": "Bladeburner01",
                "email": "Bladeburner01@gmail.com",
                "disabled": "false",
                "first_name": "Lee",
                "last_name": "Pham",
                "todos": [
                    "647c33b7257a0b5aa8bf7a3f",
                    "647c61bff3250a39f366376d",
                    "647c66cbf3250a39f366376e",
                ],
                "categories": ["647c619df3250a39f366376b", "647c61a7f3250a39f366376c"],
            }
        }


class UserInDb(User):
    hashed_password: Optional[str]

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "username": "Bladeburner01",
                "email": "Bladeburner01@gmail.com",
                "disabled": "false",
                "first_name": "Lee",
                "last_name": "Pham",
                "todos": [
                    "647c33b7257a0b5aa8bf7a3f",
                    "647c61bff3250a39f366376d",
                    "647c66cbf3250a39f366376e",
                ],
                "categories": ["647c619df3250a39f366376b", "647c61a7f3250a39f366376c"],
                "hashed_password": "$2b$12$9TObvxeCGi4Mo1X2Z0ejDuowhv/LG90pIWR6MuaQJEC8wf0yH1K0S",
            }
        }


class UpdateUserModel(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    disabled: Optional[bool] = False
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    description: Optional[str] = None
    todos: Optional[list] = None
    categories: Optional[list] = None
    hashed_password: Optional[str]

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "username": "Bladeburner01",
                "email": "Bladeburner01@gmail.com",
                "disabled": "false",
                "first_name": "Lee",
                "last_name": "Pham",
                "todos": [
                    "647c33b7257a0b5aa8bf7a3f",
                    "647c61bff3250a39f366376d",
                    "647c66cbf3250a39f366376e",
                ],
                "categories": ["647c619df3250a39f366376b", "647c61a7f3250a39f366376c"],
                "hashed_password": "$2b$12$9TObvxeCGi4Mo1X2Z0ejDuowhv/LG90pIWR6MuaQJEC8wf0yH1K0S",
            }
        }


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
