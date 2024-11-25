
# VRV Security Assignment - API Documentation

## Overview

This repository contains a Node.js-based API for managing user registrations, logins, role management, permission assignments, and CRUD operations for posts. It includes a secure role-based authentication system and user management system for handling permissions and roles for different types of users (admin, normal users, etc.). 

The project also includes functionality for managing posts and categories, making it a comprehensive solution for role-based security in web applications.

## Features

- **User Registration**: Allows new users to register by providing their name, email, and password.
- **User Login**: Provides an endpoint for users to log in with their credentials and receive a JWT token for authentication.
- **Role Management**: Admins can assign roles to users and store roles for various types of access control.
- **Permission Management**: Granular control over user permissions, where admins can assign specific permissions to users.
- **Post Management**: Users can create posts. Admins can manage posts, including post creation and updates.
- **Category Management**: Admins can create new categories for posts.

## Tech Stack

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for Node.js to build the RESTful API.
- **MongoDB**: NoSQL database to store user, role, permission, and post data.
- **JWT (JSON Web Tokens)**: Used for secure user authentication and authorization.
- **Postman**: For testing and sending API requests.

## Prerequisites

To run the project locally, you need to have the following installed:

- Node.js (v12 or above)
- MongoDB (running locally or using a cloud service like MongoDB Atlas)
- Postman (for testing API endpoints)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/TheSachinDhakad/VRV_Security_Assignment.git
cd VRV_Security_Assignment
```

### Install Dependencies

Run the following command to install all the necessary dependencies:

```bash
npm install
```

### Environment Setup

Make sure you have the `.env` file configured with the following variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/vrv_security
JWT_SECRET=your_jwt_secret_key
```

- **PORT**: The port on which the API server will run.
- **MONGO_URI**: The MongoDB connection string.
- **JWT_SECRET**: Secret key used for generating JWT tokens.

### Run the Server

To start the server, use:

```bash
npm start
```

The API will run on `http://localhost:3000`.

## API Endpoints

### 1. Register User
- **Method**: `POST`
- **URL**: `/api/register`
- **Request Body**:
  ```json
  {
    "name": "Sachin Nagar",
    "email": "sachindhakad7265@gmail.com",
    "password": "123"
  }
  ```
- **Description**: Registers a new user with a name, email, and password.

### 2. Login User
- **Method**: `POST`
- **URL**: `/api/login`
- **Request Body**:
  ```json
  {
    "email": "thesachindhakad@gmail.com",
    "password": "123"
  }
  ```
- **Description**: Logs in a user by email and password. Returns a JWT token upon successful authentication.

### 3. Create User (Admin Only)
- **Method**: `POST`
- **URL**: `/api/create-user`
- **Authentication**: Bearer token required
- **Request Body**:
  ```json
  {
    "name": "Sachin Nagar",
    "email": "sachindhakad7265@gmail.com"
  }
  ```
- **Description**: Creates a new user. Requires a Bearer token for authentication (admin access).

### 4. Add Permission to User (Admin Only)
- **Method**: `POST`
- **URL**: `/api/admin/add-permission`
- **Authentication**: Bearer token required
- **Request Body**:
  ```json
  {
    "permission_name": "Blog Management"
  }
  ```
- **Description**: Assigns a specific permission (e.g., "Blog Management") to a user.

### 5. Store Role (Admin Only)
- **Method**: `POST`
- **URL**: `/api/admin/store-role`
- **Authentication**: Bearer token required
- **Request Body**:
  ```json
  {
    "role_name": "user",
    "value": 0
  }
  ```
- **Description**: Assigns a role to a user. This endpoint requires an admin token.

### 6. Get Permissions (Admin Only)
- **Method**: `GET`
- **URL**: `/api/admin/get-permissions`
- **Authentication**: Bearer token required
- **Description**: Fetches all available permissions in the system for admin review.

### 7. Create Post
- **Method**: `POST`
- **URL**: `/api/create-post`
- **Authentication**: Bearer token required
- **Request Body**:
  ```json
  {
    "title": "New Post",
    "content": "This is the content of the new post",
    "category": "General"
  }
  ```
- **Description**: Creates a new post. Requires a Bearer token for authentication.

### 8. Add Category (Admin Only)
- **Method**: `POST`
- **URL**: `/api/admin/add-category`
- **Authentication**: Bearer token required
- **Request Body**:
  ```json
  {
    "category_name": "Technology"
  }
  ```
- **Description**: Adds a new category for posts. Requires admin authentication.

## Authentication

All routes requiring admin access are protected with JWT-based authentication. Use the `Authorization` header with the format:

```http
Authorization: Bearer <your_jwt_token>
```

### Example Token Authentication
```http
Authorization: Bearer <your_jwt_token>
```

## Postman Collection

To test the API, you can use the Postman collection provided in this repository. The collection includes all the API endpoints, and you can import it into Postman for easy testing.

## Error Handling

### 1. Unauthorized Access
- **Code**: `401 Unauthorized`
- **Message**: "Unauthorized. Please provide a valid JWT token."

### 2. Forbidden Access
- **Code**: `403 Forbidden`
- **Message**: "You do not have permission to perform this action."

### 3. Not Found
- **Code**: `404 Not Found`
- **Message**: "The requested resource could not be found."

### 4. Internal Server Error
- **Code**: `500 Internal Server Error`
- **Message**: "An unexpected error occurred on the server."

## Conclusion

This repository provides a robust API for user, role, permission, and post management, secured with JWT authentication. By using this API, you can build a role-based security system for your applications, where different users have different access levels based on their assigned roles and permissions.
