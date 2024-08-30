#!/usr/bin/env zsh

docker build --platform linux/amd64 -t cpu-deploy:latest .

docker tag cpu-deploy:latest 732284202021.dkr.ecr.us-east-1.amazonaws.com/server/cpu-deploy:latest

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 732284202021.dkr.ecr.us-east-1.amazonaws.com

docker push 732284202021.dkr.ecr.us-east-1.amazonaws.com/server/cpu-deploy:latest