# Smart IoT Monitoring System - Backend

Spring Boot backend for the Smart IoT Monitoring System, including database and Docker infrastructure for the full stack.

## Prerequisites

- WSL / Linux with Docker installed
- Start Docker before running any commands:
```bash
  sudo service docker start
```

## Project Structure

```
DXC_Juniors_Backend/
├── src/                      # Spring Boot source code
├── database/                 # MySQL Dockerfile
│   ├── Dockerfile
│   └── README.md
├── Dockerfile                # Backend Dockerfile
├── build-and-push.sh         # Build and push all images to Docker Hub
├── run.sh                    # Pull and run all containers
└── README.md
```

## Docker Hub Images

| Service | Image |
|---|---|
| Database | `salmafayed/db-service:v1.0` |
| Backend | `salmafayed/backend-service:v1.0` |
| Frontend | `salmafayed/frontend-service:v1.0` |

## Running the Project

Clone this repo then run:

```bash
chmod +x run.sh
./run.sh
```

This will automatically:
1. Create a Docker network
2. Pull and start the database container
3. Wait 40 seconds for the database to initialize
4. Pull and start the backend container
5. Pull and start the frontend container

## Access the Application

| Service | URL |
|---|---|
| Frontend | http://localhost:80 |
| Backend API | http://localhost:8080 |
| Database | localhost:3306 |

## Stopping Containers

```bash
docker stop iot-db iot-backend iot-frontend
```

## Removing Containers

```bash
docker rm -f iot-db iot-backend iot-frontend
```

## For DevOps — Build & Push Images

Only needed when code changes are made:

```bash
chmod +x build-and-push.sh
./build-and-push.sh
```

## API Endpoints

| Method | Endpoint |
|---|---|
| POST | `/api/auth/signup` |
| POST | `/api/auth/login` |
| GET | `/api/auth/profile?email=` |
| PUT | `/api/auth/profile` |