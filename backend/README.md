# Authentication & Role-Based Access Control (RBAC)🛍️

This project implements a secure **JWT-based authentication** system with **Role-Based Access Control (RBAC)** using **Node.js**, **Express.js**, **MongoDB**, and **JWT**. This is a user authentication and management API **Tinkteq Assessment** built using Node.js and Express.js. It provides various endpoints for user registration, login, password management, and role-based access control (RBAC). The system uses JWT (JSON Web Tokens) for secure authentication, and the roles include Admin, Shipper, and Carrier.
- **Admin**: Full access to all routes, including user management.
- **Shipper**: Limited access, can update personal details.
- **Carrier**: Limited access, can update personal details.

#

### Clone the Repository
```bash
git clone https://github.com/AworThales/tinkteq-auth_test.git


Go to the project directory

```bash
  cd tinkteq_auth_test
```
Install dependencies
```bash
  npm install
```

# Environment Variables🔑

To run this project, you will need to add the following environment variables to your .env file

PORT=

NODE_ENV=

FRONTEND_URL=

MONGO_URL=

JWT_SECRET=

JWT_EXPIRES_TIME=

COOKIE_EXPIRES_TIME=

SMTP_HOST=

SMTP_PORT=

SMTP_EMAIL=

SMTP_PASSWORD=

SMTP_FROM_EMAIL=

SMTP_FROM_NAME=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

#

Start the server (Development Mode)⏯️

```bash
  npm run dev
```


---


## Features

- **User Registration**: Users can register with a username, email, and password.
- **User Login**: Upon successful login, a **JWT token** is issued to the user.
- **Password Hashing**: Passwords are securely hashed before being stored in the database.
- **Password Reset**: Users can reset their password via email if they forget it.
- **Role-Based Access Control (RBAC)**: The application restricts certain API routes based on the user's role (Admin, Shipper, Carrier).
- **Profile Management**: Users can view and update their profile.

---

## Tech Stack

- **Node.js**: JavaScript runtime to build the back-end server.
- **Express.js**: Web framework for building the API routes.
- **MongoDB**: NoSQL database to store user information.
- **JWT (JSON Web Token)**: To handle secure authentication.
- **Bcrypt.js**: For hashing and comparing passwords.
- **Cloudinary (Optional)**: For handling user avatar uploads.
- **Nodemailer**: For sending email notifications (e.g., password reset links).

---

# API Documentation

## Authentication & User Management Endpoints

### 1. **User Registration** - `/api/v1/register`
- **Method**: `POST`
- **Description**: Register a new user.
- **Request Body**:
  ```json
  {
     "username": "john_doe",
      "email": "john.doe@example.com",
      "password": "securepassword",
      "role": "Admin" //optional and default "Shipper"
  }

### 2. **User Login** - `/api/v1/login`
- **Method**: `POST`
- **Description**: Login a new user.
- **Request Body**:
  ```json
  {
    "username": "john_doe",
    "password": "securepassword"
  }


### 3. **User Logout** - `/api/v1/logout `
- **Method**: `GET`
- **Description**: Logout a new user.
- **Response**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }

### 4. **Forgot Password** - `/api/v1/password/forgot`
- **Method**: `POST`
- **Description**:Send a password reset email to the user.
- **Request Body**:
  ```json
  {
    
    
    "email": "john.doe@example.com"
  }


### 5. **Reset Password** - `/api/v1/password/reset/:token`
- **Method**: `PUT`
- **Description**:Reset the user password using the reset token.
- **Request Body**:
  ```json
  {
    "password": "new_password",
    "comfirmPassword": "new_password"
  }



### 6. **Get User Profile** - `/api/v1/me`
- **Method**: `GET`
- **Description**:Get the details of the currently logged-in use.
- **Authorization**:Requires JWT token in the Authorization header.
- **Response**:
  ```json
  {
      "success": true,
      "user": {
      "id": "user_id",
      "username": "string",
      "email": "string",
      "role": "Admin | Shipper | Carrier"
  }
  }

### 7. **Update User Profile* - `/api/v1/me/update`
- **Method**: `PUT`
- **Description**:Update the profile information of the currently logged-in user
- **Request Body**:
  ```json
  {
      "firstname": "string",
      "lastname": "string",
      "username": "string",
      "email": "string",
      "avatar": "image_url (optional)"
  }


### 8. **Change Password* - `/api/v1/password/update`
- **Method**: `PUT`
- **Description**:Change the password of the currently logged-in user
- **Request Body**:
  ```json
  {
     "oldPassword": "old_password",
     "newPassword": "new_password"
  }

### 9. **Get All Users (Admin Only)** - `/api/v1/admin/users`
- **Method**: `GET`
- **Description**:Get a list of all users. Admin access only.
- **Authorization**:Requires Admin role.
- **Response**:
  ```json
  {
    "success": true,
    "users": [
      {
        "id": "user_id",
        "username": "string",
        "email": "string",
        "role": "Admin | Shipper | Carrier"
      }
    ]
  }


### 10. **Get User Details (Admin Only)** - `/api/v1/admin/user/:id`
- **Method**: `GET`
- **Description**:Get details of a user by ID. Admin access only.
- **Authorization**:Requires Admin role.
- **Response**:
  ```json
  {
    "success": true,
    "users": [
      {
        "id": "user_id",
        "username": "string",
        "email": "string",
        "role": "Admin | Shipper | Carrier"
      }
    ]
  }

### 11. **Get User Details (Admin Only)** - `/api/v1/admin/user/:id`
- **Method**: `GET`
- **Description**:Get details of a user by ID. Admin access only.
- **Authorization**:Requires Admin role.
- **Response**:
  ```json
  {
    "success": true,
    "users": [
      {
        "id": "user_id",
        "username": "string",
        "email": "string",
        "role": "Admin | Shipper | Carrier"
      }
    ]
  }


### 12. **Update User Profile (Admin Only)** - `/api/v1/admin/user/:id`
- **Method**: `PUT`
- **Description**:Update the profile information of a user. Admin access only..
- **Authorization**:Requires Admin role.
- **Request Body**:
  ```json
  {
        "firstname": "string",
      "lastname": "string",
      "username": "string",
      "email": "string",
      "role": "Admin | Shipper | Carrier"
  }



### 11. **Delete User (Admin Only)** - `/api/v1/admin/user/:id`
- **Method**: `DELETE`
- **Description**:Delete a user by ID. Admin access only.
- **Authorization**:Requires Admin role.
- **Response**:
  ```json
  {
    "success": true,
    "message": "User deleted successfully"
  }