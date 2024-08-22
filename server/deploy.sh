#!/bin/bash

# Function to check if the last command was successful
check_status() {
    if [ $? -ne 0 ]; then
        echo "Error occurred during: $1"
        exit 1
    fi
}

# Check if NVIDIA GPUs are available
if command -v nvidia-smi &> /dev/null; then
    echo "CUDA-capable GPU detected. Deploying CUDA version..."

    # Build and deploy the app-cuda service
    docker build -f Dockerfile.cuda -t vision-tag-cuda .
    check_status "Building CUDA image"

    docker run -d --name app-cuda \
      --runtime=nvidia \
      -e NVIDIA_VISIBLE_DEVICES=all \
      -e NVIDIA_DRIVER_CAPABILITIES=compute,utility \
      -p 8000:8000 vision-tag-cuda
    check_status "Deploying CUDA version"

else
    echo "No CUDA-capable GPU detected. Deploying regular CPU version..."

    # Build and deploy the app-cpu service
    docker build -f Dockerfile.cpu -t vision-tag-cpu .
    check_status "Building CPU image"

    docker run -d --name app-cpu \
      -p 8000:8000 vision-tag-cpu
    check_status "Deploying CPU version"
fi

# Check if any containers are running
running_containers=$(docker ps --filter "status=running" --format "{{.Names}}")

if [ -z "$running_containers" ]; then
    echo "No containers are currently running."
    echo "You can check the logs for errors using: docker logs <container_name>"
    exit 1
else
    echo "The following containers are running:"
    echo "$running_containers"
    echo "Deployment successful."
fi