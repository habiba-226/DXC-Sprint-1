#!/bin/bash

set -e

DOCKER_USERNAME="salmafayed"

echo "Logging in to Docker Hub..."
docker login -u $DOCKER_USERNAME

echo "Building frontend image..."
docker build -t $DOCKER_USERNAME/frontend-service:v1.0 .

echo "Pushing frontend image..."
docker push $DOCKER_USERNAME/frontend-service:v1.0

echo "Done!"
