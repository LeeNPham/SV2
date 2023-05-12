# from typing import Optional
from pydantic import BaseModel, Field
from bson.objectid import ObjectId



class Todo(BaseModel):
    # id:  ObjectId = Field(..., alias="_id")
    title: str
    description: str

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