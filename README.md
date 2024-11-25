# Role API Postman Collection

## Features

- **Role-based Authentication:** Implement secure authentication based on user roles, ensuring that users have appropriate access levels.
- **Permission Management:** Define and manage granular permissions to control user actions and access within the application.
- **User Management API Endpoints:** Explore a variety of API endpoints for effective user management, allowing operations such as user creation, deletion, and retrieval.
- **Post and Post Category:** A newly added feature includes post and post category management, expanding the functionality of the application.

This repository contains a Postman collection for testing various Role-related API endpoints. These API endpoints are designed for user registration, login, role management, permission assignments, and more.

## Postman Collection Overview

The Postman collection includes the following endpoints:

1. **Register User**  
   - **Method**: `POST`
   - **URL**: `http://localhost:3000/api/register`
   - **Body**: 
     ```json
     {
       "name": "Sachin Nagar",
       "email": "sachindhakad7265@gmail.com",
       "password": "123"
     }
     ```

2. **Login User**  
   - **Method**: `POST`
   - **URL**: `http://localhost:3000/api/login`
   - **Body**: 
     ```json
     {
       "email": "thesachindhakad@gmail.com",
       "password": "123"
     }
     ```

3. **Create User**  
   - **Method**: `POST`
   - **URL**: `http://localhost:3000/api/create-user`
   - **Authentication**: Bearer token required
   - **Body**:
     ```json
     {
       "name": "Sachin Nagar",
       "email": "sachindhakad7265@gmail.com"
     }
     ```

4. **Add Permission to User**  
   - **Method**: `POST`
   - **URL**: `http://localhost:3000/api/admin/add-permission`
   - **Authentication**: Bearer token required
   - **Body**:
     ```json
     {
       "permission_name": "Blog Management"
     }
     ```

5. **Store Role**  
   - **Method**: `POST`
   - **URL**: `http://localhost:3000/api/admin/store-role`
   - **Authentication**: Bearer token required
   - **Body**:
     ```json
     {
       "role_name": "user",
       "value": 0
     }
     ```

6. **Get Permissions**  
   - **Method**: `GET`
   - **URL**: `http://localhost:3000/api/admin/get-permissions`
   - **Authentication**: Bearer token required

## Authentication

For endpoints requiring authentication, use the Bearer token in the Authorization header. Example:

