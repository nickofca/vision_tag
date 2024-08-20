from PIL import Image
from PIL.Image import Image as PILImage
from io import BytesIO
from typing import Union
import numpy as np
import torch
from yolov5.models.common import Detections
import base64


if torch.backends.mps.is_available():
    device = torch.device("mps")
else:
    device = torch.device("cpu")

model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True, device=device)


async def process_image(image_byte_string):
    # Decode the base64 string
    image_data = base64.b64decode(image_byte_string.split(',')[1])
    # Read the contents of the stream
    file_like_object = BytesIO(image_data)  # Create a BytesIO object
    return Image.open(file_like_object)


async def predict(
    image: Union[PILImage, np.ndarray],
):
    with (torch.inference_mode(), torch.autocast("cuda", dtype=torch.bfloat16)):
        return model(image)


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

    return bool(centered_objects_df["class"].iloc[0] == 0) # Alias for "person" class
