# Database Infrastructure

This folder contains the Dockerfile for the MySQL database used in the Smart IoT Monitoring System.

## Prerequisites
- WSL (Windows Subsystem for Linux) / Linux with Docker installed
- Ensure the Docker service is running before executing any commands:
```bash
  sudo service docker start
```

## Configuration

The following credentials are configured in the Dockerfile:

| Setting | Value |
|---|---|
| Root Password | root123 |
| Database Name | iot_db |
| User | iot_user |
| User Password | iot_pass |
| Port | 3306 |

## Setup Instructions

### 1. Build the Docker image
```bash
cd database
docker build -t iot-mysql .
```

### 2. Run the container
```bash
docker run -d -p 3306:3306 --name iot-db iot-mysql
```

### 3. Verify the container is running
```bash
docker ps
```
- Should see iot-db in output with status "up"

### 4. Login to MySQL
```bash
docker exec -it iot-db mysql -u root -proot123
```

## Stopping & Removing the Container

```bash
docker stop iot-db
docker rm iot-db
```

## Notes

- Make sure port 3306 is not already in use before running the container.
- If using WSL, stop any local MySQL service first: `sudo service mysql stop`