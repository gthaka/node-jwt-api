# Installation and Deployment using Docker

If you prefer using Docker, continue below

## Prerequisites

- Docker

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/gthaka/node-jwt-api.git
   cd node-jwt-api
   ```

2. Update the environment variables accordingly in the [docker-compose.yml](docker-compose.yml) file.

3. Build and run the Docker containers:

   ```
   docker-compose up
   ```

   This will build the Docker images and start the Node Server and PostgreSQL containers.

4. Access the API endpoints using a tool like Postman or a web browser. The server should be running at http://localhost:3004.

## Usage

1. Access the API endpoints using a tool like Postman or a web browser.

2. Follow the documentation to test different endpoints for user registration, sign-in, token management, etc.

## Deployment Considerations

    The [docker-compose.yml](docker-compose.yml) file is configured to use the official PostgreSQL 15 image and a custom Node.js 18 Alpine-based image. Adjust the versions and configurations as needed.
    For production deployment, consider using a reverse proxy (e.g., Nginx) to handle SSL termination and load balancing.
    Store sensitive environment variables securely, preferably using environment files or a secrets management tool.

## Documentation

For detailed information on how to use the User Identity Server and its endpoints, refer to the [API Documentation](API_DOCUMENTATION.md).
