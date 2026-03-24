from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import numpy as np
import cv2
from io import BytesIO

app = FastAPI()

# ✅ CORS (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ IMAGE PROCESS FUNCTION
def process_image(image, operation):
    if operation == "grayscale":
        return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    elif operation == "blur":
        return cv2.GaussianBlur(image, (15, 15), 0)

    elif operation == "edge":
        return cv2.Canny(image, 100, 200)

    elif operation == "invert":
        return cv2.bitwise_not(image)

    elif operation == "brightness":
        return cv2.convertScaleAbs(image, alpha=1, beta=50)

    elif operation == "contrast":
        return cv2.convertScaleAbs(image, alpha=2, beta=0)

    elif operation == "sharpen":
        kernel = np.array([[0, -1, 0],
                           [-1, 5,-1],
                           [0, -1, 0]])
        return cv2.filter2D(image, -1, kernel)

    elif operation == "threshold":
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
        return thresh

    else:
        return image


# ✅ MAIN API ROUTE (MATCH FRONTEND)
@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    operation: str = Form(...)
):
    try:
        contents = await file.read()

        # Convert to OpenCV format
        np_arr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # Process image
        processed = process_image(image, operation)

        # Handle grayscale images
        if len(processed.shape) == 2:
            processed = cv2.cvtColor(processed, cv2.COLOR_GRAY2BGR)

        # Encode to PNG
        _, buffer = cv2.imencode(".png", processed)

        return StreamingResponse(
            BytesIO(buffer.tobytes()),
            media_type="image/png"
        )

    except Exception as e:
        print("ERROR:", e)
        return {"error": str(e)}