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


### Define the service to manage podman deployment
# Define the service name
SERVICE_NAME="my-podman-service.service"

# Define the service content
SERVICE_CONTENT="[Unit]
Description=Podman Container Management Service
After=network.target

[Service]
Type=oneshot
ExecStartPre=/usr/bin/sudo /usr/bin/podman container prune -f
ExecStartPre=/usr/bin/sudo /bin/sh -c '/usr/local/bin/aws ecr get-login-password --region us-east-1 | /usr/bin/podman login --username AWS --password-stdin 732284202021.dkr.ecr.us-east-1.amazonaws.com'
ExecStartPre=/usr/bin/sudo /usr/bin/podman pull 732284202021.dkr.ecr.us-east-1.amazonaws.com/server/cpu-deploy:latest
ExecStart=/usr/bin/sudo /usr/bin/podman run -d -p 8000:8000 732284202021.dkr.ecr.us-east-1.amazonaws.com/server/cpu-deploy:latest
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target"

# Create the service file
echo "Creating systemd service file: /etc/systemd/system/$SERVICE_NAME"
echo "$SERVICE_CONTENT" | sudo tee /etc/systemd/system/$SERVICE_NAME > /dev/null

# Reload systemd to recognize the new service
echo "Reloading systemd daemon..."
sudo systemctl daemon-reload

# Enable the service to start on boot
echo "Enabling $SERVICE_NAME to start on boot..."
sudo systemctl enable $SERVICE_NAME

# Optionally start the service immediately
echo "Starting $SERVICE_NAME..."
sudo systemctl start $SERVICE_NAME