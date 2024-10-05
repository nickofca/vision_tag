import cv2
import numpy as np
import torch
from loguru import logger
from yolox.data.data_augment import ValTransform
from yolox.data.datasets import COCO_CLASSES
from yolox.exp import get_exp
from yolox.utils import fuse_model, get_model_info, postprocess
import os
from io import BytesIO
import base64

# Define the Predictor class (simplified for this context)
class Predictor(object):
    def __init__(
        self,
        model,
        exp,
        cls_names=COCO_CLASSES,
        device="cpu",
        fp16=False,
        legacy=False,
    ):
        self.model = model
        self.cls_names = cls_names
        self.num_classes = exp.num_classes
        self.confthre = exp.test_conf
        self.nmsthre = exp.nmsthre
        self.test_size = exp.test_size
        self.device = device
        self.fp16 = fp16
        self.preproc = ValTransform(legacy=legacy)

    def inference(self, img):
        img_info = {"id": 0}

        # img is expected to be an OpenCV image (numpy array)
        img_info["file_name"] = None

        height, width = img.shape[:2]
        img_info["height"] = height
        img_info["width"] = width
        img_info["raw_img"] = img

        ratio = min(self.test_size[0] / img.shape[0], self.test_size[1] / img.shape[1])
        img_info["ratio"] = ratio

        img, _ = self.preproc(img, None, self.test_size)
        img = torch.from_numpy(img).unsqueeze(0)
        img = img.float()
        if self.device == "gpu":
            img = img.cuda()
            if self.fp16:
                img = img.half()  # to FP16

        with torch.no_grad():
            outputs = self.model(img)
            outputs = postprocess(
                outputs, self.num_classes, self.confthre,
                self.nmsthre, class_agnostic=True
            )
        return outputs, img_info

# Global variables to hold the model and predictor instances
MODEL = None
PREDICTOR = None

def initialize_model(
    exp_file=None,
    ckpt_file=None,
    device="cpu",
    fp16=False,
    legacy=False,
    fuse=False
):
    global MODEL, PREDICTOR

    # Load the experiment configuration
    exp = get_exp(exp_file, None)

    # Build the model from the experiment
    model = exp.get_model()
    logger.info("Model Summary: {}".format(get_model_info(model, exp.test_size)))

    if device == "gpu":
        model.cuda()
        if fp16:
            model.half()  # to FP16
    model.eval()

    # Load model weights from checkpoint
    if ckpt_file is None:
        ckpt_file = os.path.join(exp.output_dir, exp.exp_name, "best_ckpt.pth")
    ckpt = torch.load(ckpt_file, map_location="cpu")
    model.load_state_dict(ckpt["model"])
    logger.info("Loaded checkpoint from {}".format(ckpt_file))

    # Fuse the model if specified
    if fuse:
        model = fuse_model(model)

    # Create the predictor instance
    predictor = Predictor(
        model=model,
        exp=exp,
        cls_names=COCO_CLASSES,
        device=device,
        fp16=fp16,
        legacy=legacy,
    )

    # Store the model and predictor in global variables
    MODEL = model
    PREDICTOR = predictor


def predict(img, target_class=None, score_threshold=0.0):
    """
    Detects objects in an image .

    Args:
        img (): The image data in bytes.
        target_class (str or int, optional): The class name or class ID to filter detections.
            If None, all classes are considered. Default is None.
        score_threshold (float): The minimum score threshold for detections. Default is 0.0.

    Returns:
        List[dict]: A list of detections, each represented as a dictionary.
    """
    global MODEL, PREDICTOR
    if MODEL is None or PREDICTOR is None:
        raise Exception(
            "Model is not initialized. Call initialize_model() before find_objects()."
        )

    # Run inference
    outputs, img_info = PREDICTOR.inference(img)

    # Check if any detections are found
    if outputs[0] is None:
        return []

    # Extract bounding boxes, class IDs, and scores
    output = outputs[0].cpu().numpy()
    bboxes = output[:, 0:4]
    scores = output[:, 4] * output[:, 5]
    class_ids = output[:, 6].astype(int)

    # Rescale bounding boxes to the original image size
    ratio = img_info["ratio"]
    bboxes /= ratio

    # Prepare the list of bounding boxes
    bounding_boxes = []
    for bbox, score, class_id in zip(bboxes, scores, class_ids):
        if score < score_threshold:
            continue
        if target_class is not None:
            # Check if the target_class matches the class_id or class name
            if isinstance(target_class, int):
                if class_id != target_class:
                    continue
            elif isinstance(target_class, str):
                class_name = PREDICTOR.cls_names[class_id]
                if class_name != target_class:
                    continue
            else:
                raise ValueError(
                    "target_class must be an int (class_id) or str (class_name)"
                )

        x0, y0, x1, y1 = bbox
        bounding_box = {
            "class_id": int(class_id),
            "class_name": PREDICTOR.cls_names[class_id],
            "score": float(score),
            "bbox": [float(x0), float(y0), float(x1), float(y1)],
        }
        bounding_boxes.append(bounding_box)

    return bounding_boxes


def process_image(image_byte_string):
    # Decode the base64 string
    image_data = base64.b64decode(image_byte_string)
    # Read the contents of the stream
    image_bytes = BytesIO(image_data)  # Create a BytesIO object
    # Decode the image from bytes
    nparr = np.frombuffer(image_bytes.getvalue(), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Failed to decode image from bytes.")
    return img


# Initialize the model (do this once at the start)
initialize_model(
    exp_file="vision/yolox/yolox_m.py",  # Replace with your experiment file path
    ckpt_file="vision/yolox/yolox_m.pth",  # Replace with your checkpoint file path
    device="cpu",  # or "gpu" if you have a CUDA-enabled GPU
    fp16=False,  # Set to True if using half-precision inference on GPU
    fuse=False  # Set to True to fuse the model for faster inference
)