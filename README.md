# Node JWT API Server

This is a Node.js application built to handle user JWT tokens, and PostgreSQL for data storage. It provides endpoints for user registration, sign-in, token management, email verification, and more.

## Features

- User registration with password hashing
- User sign-in with JWT token generation
- Token-based authentication and authorization
- Token reset functionality with email verification
- User details endpoint
- Email verification and token resending
- Middleware for protecting routes
- PostgreSQL database for data storage

## Prerequisites

- Node.js (Version 18.X.X)
- PostgreSQL database

**_[For Docker installation guide, Click Here](README_DOCKER.md)_**

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/gthaka/node-jwt-api.git
   cd node-jwt-api
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up your PostgreSQL database and update the .env file with your database configuration.

4. Build the TypeScript code:

   ```
   npm run build
   ```

5. Run the application:

   ```
   node dist/app.js
   ```

## Usage

1. Access the API endpoints using a tool like Postman or a web browser.

2. Follow the documentation to test different endpoints for user registration, sign-in, token management, etc.

## Documentation

For detailed information on how to use the User Identity Server and its endpoints, refer to the [API Documentation](API_DOCUMENTATION.md).

## Contributing

Contributions are welcome! If you find any issues or would like to add new features, please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
