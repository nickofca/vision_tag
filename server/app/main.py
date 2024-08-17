import torch
from sam2.sam2_image_predictor import SAM2ImagePredictor
from fastapi import FastAPI, File, UploadFile, Form
from pydantic import BaseModel
from typing import Optional, Union
from io import BytesIO
from PIL import Image
from PIL.Image import Image as PILImage
from model import show_masks
import numpy as np
from yolov5.models.common import Detections

app = FastAPI()

class NumberRequest(BaseModel):
    number: int

class NumberResponse(BaseModel):
    result: int

@app.post("/add/")
async def add_number(request: NumberRequest) -> NumberResponse:
    result = request.number + 8
    return NumberResponse(result=result)


class ImageMetadata(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

@app.post("/predict_sam/")
async def predict(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: Optional[str] = Form(None)
):
    if False: #torch.backends.mps.is_available():
        device = torch.device("mps")
    else:
        device = torch.device("cpu")

    predictor = SAM2ImagePredictor.from_pretrained("facebook/sam2-hiera-tiny",
                                                   device=device)

    with torch.inference_mode(), torch.autocast("cuda", dtype=torch.bfloat16):
        content = await file.read()  # Read the contents of the UploadFile
        file_like_object = BytesIO(content)  # Create a BytesIO object
        img = Image.open(file_like_object).convert("RGB")
        predictor.set_image(img)

        input_point = np.array([[round(img.size[0]/2),
                                 round(img.size[1]/2)]])
        input_label = np.array([1])

        masks, scores, logits = predictor.predict(
            point_coords=input_point,
            point_labels=input_label,
            multimask_output=True,
        )
        sorted_ind = np.argsort(scores)[::-1]
        masks = masks[sorted_ind]
        scores = scores[sorted_ind]
        logits = logits[sorted_ind]

        show_masks(img, masks, scores, point_coords=input_point, input_labels=input_label, borders=True)

        print("done")


async def yolo_predict(
    img: Union[PILImage, np.ndarray],
):
    if torch.backends.mps.is_available():
        device = torch.device("mps")
    else:
        device = torch.device("cpu")

    model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True, device=device)

    with (torch.inference_mode(), torch.autocast("cuda", dtype=torch.bfloat16)):
        return model(img)


async def yolo_scoring(
    results: Detections,
):
    # Parse results
    results_df = results.pandas().xyxy[0]

    # If no detected objects, report a miss
    if results_df.shape[0] == 0:
        return False


    # Check for objects overlapping centerpoint
    mid_x, mid_y = list(map(lambda x: round(x/2), results.ims[0].shape[0:2]))
    centered_objects_df = results_df.loc[(results_df.xmin < mid_x) & (results_df.xmax > mid_x) & (results_df.ymin < mid_y) & (results_df.ymax > mid_y)]

    # If no hit objects, report a miss
    if centered_objects_df.shape[0] == 0:
        return False

    return bool(centered_objects_df["class"][0] == 0) # Alias for "person" class


@app.post("/score_shot/")
async def score_shot_yolo(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: Optional[str] = Form(None)
):
    # Process image data
    content = await file.read()  # Read the contents of the UploadFile
    file_like_object = BytesIO(content)  # Create a BytesIO object
    img = Image.open(file_like_object).convert("RGB")

    # Perform YOLO predictions
    results = await yolo_predict(img)

    # Score YOLO predictions
    score_bool = await yolo_scoring(results)

    return {"hit": int(score_bool)}