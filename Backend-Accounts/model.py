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
    username: Optional[str] = None
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = False


class UpdateUserModel(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = False

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "exampleUser": {
                "username": "Bladeburner01",
                "email": "Bladeburner01@gmail.com",
                "full_name": "Lee Pham",
                "disabled": False,
            }
        }


class UserInDB(User):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    hashed_password: str

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "User": {
                "username": "Bladeburner01",
                "email": "Bladeburner01@gmail.com",
                "full_name": "Lee Pham",
                "hashed_password": "$2b$12$9TObvxeCGi4Mo1X2Z0ejDuowhv/LG90pIWR6MuaQJEC8wf0yH1K0S",
                "disabled": False,
            }
        }
