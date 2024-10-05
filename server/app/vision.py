import base64
import math

from server.app.vision.yolox.model import predict as yolox_predict, process_image as yolox_process_image
from server.app.vision.segment_anything_model_2.model import predictor as sam2_predictor
from server.app.vision.segment_anything_model_2.model import show_masks
import numpy as np

def find_center_overlapping_boxes(bounding_boxes, image_width, image_height):
    """
    Finds bounding boxes that overlap with the center of the image.

    Args:
        bounding_boxes (List[dict]): A list of bounding boxes, each represented as a dictionary.
        image_width (int): The width of the image.
        image_height (int): The height of the image.

    Returns:
        List[dict]: A list of bounding boxes that overlap with the center of the image.
    """
    center_x = image_width / 2
    center_y = image_height / 2

    center_overlapping_boxes = []

    for bbox in bounding_boxes:
        x0, y0, x1, y1 = bbox['bbox']

        # Check if the center point lies within the bounding box
        if x0 <= center_x <= x1 and y0 <= center_y <= y1:
            center_overlapping_boxes.append(bbox)

    return center_overlapping_boxes


# Function to filter hit objects based on user-defined metadata
def filter_hit_objects(bounding_boxes, user_metadata):
    """
    Filters bounding boxes based on user-defined metadata.

    Args:
        bounding_boxes (List[dict]): List of bounding boxes with class_id and class_name.
        user_metadata (dict): Dictionary containing metadata to filter objects.

    Returns:
        List[dict]: Filtered list of bounding boxes.
    """
    filtered_boxes = []
    for bbox in bounding_boxes:
        class_name = bbox['class_name']
        if class_name in user_metadata.get('allowed_classes', []):
            filtered_boxes.append(bbox)
    return filtered_boxes

# Function to apply SAM2 segmentation within bounding boxes
def apply_segmentation(img, bounding_boxes, score_threshold=0.8):
    """
    Applies SAM2 segmentation within the given bounding boxes.

    Args:
        img (numpy.ndarray): The image array.
        bounding_boxes (List[dict]): List of bounding boxes.

    Returns:
        List[dict]: List of segmentation masks corresponding to the bounding boxes.
    """
    # Set target image
    sam2_predictor.set_image(img)
    # Format bounding boxes
    input_boxes = np.array([target_dict["bbox"] for target_dict in bounding_boxes])
    # Find segmentations
    masks, scores, _ = sam2_predictor.predict(
        point_coords=None,
        point_labels=None,
        box=input_boxes,
        multimask_output=False,
    )
    return [mask for mask, score in zip(masks, scores) if score > score_threshold]


def filter_to_center_overlapping_masks(masks):
    centered_masks = []
    for mask in masks:
        if filter_to_center_overlapping_mask(mask):
            centered_masks.append(mask)
    return centered_masks


def filter_to_center_overlapping_mask(mask):
    mask = np.squeeze(mask)
    x, y = mask.shape
    return bool(mask[round(x/2), round(y/2)])


# Main workflow function
def machine_vision_pipeline(image_base64, user_metadata):
    """
    The main function orchestrating the machine vision workflow.

    Args:
        image_base64 (str): Base64 encoded image string.
        user_metadata (dict): User-defined metadata for filtering.

    Returns:
        dict: The final result after processing.
    """
    # Step 1: Preprocess the image
    img = yolox_process_image(image_base64)
    image_height, image_width = img.shape[:2]

    # Step 2: Run object detection using YOLO-X
    bounding_boxes = yolox_predict(img)

    # Step 3: Find objects overlapping with the center of the image
    center_overlapping_boxes = find_center_overlapping_boxes(bounding_boxes, image_width, image_height)

    # Step 4: Filter out hit objects based on user-defined metadata
    filtered_boxes = filter_hit_objects(center_overlapping_boxes, user_metadata)

    # Step 5: Apply SAM2 segmentation within the bounding boxes
    object_masks = apply_segmentation(img, filtered_boxes)

    # Step 6: Filter out segmentations that don't overlap with the centerpoint
    centerpoint_overlapping_masks = filter_to_center_overlapping_masks(object_masks)

    return centerpoint_overlapping_masks

# Example usage
if __name__ == "__main__":
    # Open a JPEG image and convert it to a Base64-encoded string
    with open('../../data/test_photos/bullseye.jpg', 'rb') as image_file:
        image_bytes = image_file.read()
        image_base64 = base64.b64encode(image_bytes).decode('utf-8')

    # User-defined metadata for filtering
    user_metadata = {
        'allowed_classes': ['person']  # Example classes
    }

    result = machine_vision_pipeline(image_base64, user_metadata)
    show_masks(yolox_process_image(image_base64), result)
    print("Trial run completed: Centered masks should return here")