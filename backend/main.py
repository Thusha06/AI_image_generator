from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageFilter
import os

from database import engine, SessionLocal
from models import Base, ImageHistory

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "processed"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    model: str = Form(...)
):
    input_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(input_path, "wb") as f:
        f.write(await file.read())

    img = Image.open(input_path)

    if model == "grayscale":
        processed = img.convert("L")
    elif model == "blur":
        processed = img.filter(ImageFilter.BLUR)
    elif model == "edges":
        processed = img.filter(ImageFilter.FIND_EDGES)
    else:
        processed = img

    output_path = os.path.join(UPLOAD_FOLDER, "processed_" + file.filename)
    processed.save(output_path)

    db = SessionLocal()
    history = ImageHistory(
        filename=file.filename,
        model_used=model,
        processed_path=output_path
    )
    db.add(history)
    db.commit()
    db.close()

    return FileResponse(output_path, media_type="image/png")

@app.get("/history")
def get_history():
    db = SessionLocal()
    data = db.query(ImageHistory).all()
    db.close()

    return [
        {
            "filename": item.filename,
            "model": item.model_used,
            "time": item.created_at
        }
        for item in data
    ]