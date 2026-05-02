#!/bin/bash

DOCKER_USERNAME="salmafayed"

echo "Logging in to Docker Hub..."
docker login -u $DOCKER_USERNAME

echo "Building database image..."
docker build -t $DOCKER_USERNAME/db-service:v1.0 ./database

echo "Building backend image..."
docker build -t $DOCKER_USERNAME/backend-service:v1.0 .

echo "Pushing database image..."
docker push $DOCKER_USERNAME/db-service:v1.0

echo "Pushing backend image..."
docker push $DOCKER_USERNAME/backend-service:v1.0

echo "Done!"