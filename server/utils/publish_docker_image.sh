#!/usr/bin/env zsh

# Use dockerfile directory as working directory for simplicity
cd ..

# Build the image for the specified platform using docker
docker build --platform linux/amd64 -t cpu-deploy:latest .

# Tag the image for ECR
docker tag cpu-deploy:latest 732284202021.dkr.ecr.us-east-1.amazonaws.com/server/cpu-deploy:latest

# Log in to AWS ECR (docker uses Docker's login mechanism, so this part remains the same)
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 732284202021.dkr.ecr.us-east-1.amazonaws.com

# Push the image to AWS ECR
docker push 732284202021.dkr.ecr.us-east-1.amazonaws.com/server/cpu-deploy:latest