#!/bin/bash

# Ensure the script stops if any command fails
set -e

# Install AWS CLI
sudo apt-get update -y
sudo apt-get install -y unzip
curl -s "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -q awscliv2.zip
sudo ./aws/install

# Install Podman
sudo apt-get install -y podman

# Pull the container image from ECR using Podman
sudo aws ecr get-login-password --region us-east-1 | podman login --username AWS --password-stdin 732284202021.dkr.ecr.us-east-1.amazonaws.com

# Run the container using Podman
sudo podman run -d -p 8000:8000 732284202021.dkr.ecr.us-east-1.amazonaws.com/server/cpu-deploy:latest

# Path to rc.local
RC_LOCAL="/etc/rc.local"

# Commands to be added to rc.local
COMMANDS=$(cat <<EOF
# Kill existing pods
sudo podman container prune

# Pull the container image from ECR using Podman
sudo aws ecr get-login-password --region us-east-1 | podman login --username AWS --password-stdin 732284202021.dkr.ecr.us-east-1.amazonaws.com

# Run the container using Podman
sudo podman run -d -p 8000:8000 732284202021.dkr.ecr.us-east-1.amazonaws.com/server/cpu-deploy:latest

# Close out
exit 0
EOF
)

echo "$COMMANDS" | sudo tee -a $RC_LOCAL > /dev/null
sudo chmod +x $RC_LOCAL
