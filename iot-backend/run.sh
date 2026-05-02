#!/bin/bash

set -e

DOCKER_USERNAME="salmafayed"

echo "Creating Docker network..."
docker network create iot-network 2>/dev/null || echo "Network already exists, skipping..."

echo "Pulling images from Docker Hub..."
docker pull $DOCKER_USERNAME/db-service:v1.0
docker pull $DOCKER_USERNAME/backend-service:v1.0
docker pull $DOCKER_USERNAME/frontend-service:v1.0

echo "Starting database container..."
docker run -d --name iot-db \
  --network iot-network \
  -p 3306:3306 \
  $DOCKER_USERNAME/db-service:v1.0

echo "Waiting for database to be ready..."
sleep 40

echo "Starting backend container..."
docker run -d --name iot-backend \
  --network iot-network \
  -p 8080:8080 \
  $DOCKER_USERNAME/backend-service:v1.0

echo "Starting frontend container..."
docker run -d --name iot-frontend \
  --network iot-network \
  -p 80:80 \
  $DOCKER_USERNAME/frontend-service:v1.0

echo "All containers are up! ✅"
echo "Frontend: http://localhost:80"
echo "Backend:  http://localhost:8080"
echo "Database: localhost:3306"

docker ps