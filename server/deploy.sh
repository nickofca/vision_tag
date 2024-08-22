#!/bin/bash

# Check if NVIDIA GPUs are available
if command -v nvidia-smi &> /dev/null; then
    echo "CUDA-capable GPU detected. Deploying CUDA version..."
    docker-compose up -d app-cuda
else
    echo "No CUDA-capable GPU detected. Deploying regular Ubuntu version..."
    docker-compose up -d app-cpu
fi

