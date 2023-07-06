from database import upload_to_db, get_file_from_db, download_file_from_db
from fastapi import FastAPI, HTTPException, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload-photo", tags=["Uploads"])
async def upload_photo(response: Response, photo: UploadFile = File(...)):
    photo_data = await photo.read()
    response = await upload_to_db(photo, photo_data)
    response.headers["Access-Control-Allow-Origin"] = "*"
    return {
        "message": "Photo uploaded successfully",
        "file_id": str(response.inserted_id),
    }


@app.get("/files/{file_id}", tags=["Uploads"])
async def get_file(response: Response, file_id: str):
    response = await get_file_from_db(file_id)
    if response:
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    raise HTTPException(status_code=404, detail="File not found")


@app.get("/files/download/{file_id}", tags=["Uploads"])
async def get_file(response: Response, file_id: str):
    response = await download_file_from_db(file_id)
    if response:
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response
    raise HTTPException(status_code=404, detail="File not found")
