# COURSIFY Backend Server

This is the backend server for COURSIFY, a course selling website. It provides the necessary APIs to handle user authentication, course management, and other related functionalities. Both users and admins can access and use this website.

## Technologies Used

- Node.js
- Express.js
- JSON Web Tokens (JWT) for authentication
- Mongoose for MongoDB integration

## Prerequisites

Make sure you have the following installed on your machine:

- Node.js: [https://nodejs.org](https://nodejs.org)
- MongoDB: [https://www.mongodb.com](https://www.mongodb.com)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your/repo.git
   ```

2. Navigate to the project directory:

   ```bash
   cd serverCoursify
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Configure the environment variables:

   - Create a `.env` file in the root of the project.
   - Define the following variables:

     ```
     PORT=3000
     JWT_SECRET=your_secret_key
     MONGODB_URI=your_mongodb_connection_uri
     ```

5. Start the server:

   ```bash
   npm start
   ```

## API Endpoints

The following API endpoints are available:

- **Authentication:**
  - `POST /admin/register`: Register a new admin.
  - `POST /admin/login`: Log in and obtain an access token.
  - `POST /user/register`: Register a new user.
  - `POST /user/login`: Log in and obtain an access token.

- **Courses:**
  - `GET /courses`: Get all courses.
  - `GET /courses/:id`: Get a specific course by ID.
  - `POST /courses`: Create a new course (admin only).
  - `PUT /courses/:id`: Update a course by ID (admin only).
  - `DELETE /courses/:id`: Delete a course by ID (admin only).

- **User Profile:**
  - `GET /user/courses`: Get all the courses which are published.
  - `GET /user/purchasedCourses`: Get all the courses which are purchased by the particular user.
  - `Post /user/courses/:id`: Purchase the particular course for the specific user.

## User Roles and Permissions

COURSIFY supports two user roles: user and admin. The role is determined during the registration process.

- **User:** A user can browse and purchase courses, access the course.

- **Admin:** An admin has additional permissions to manage courses. They can create, update, and delete courses.

## Folder Structure

The project structure is organized as follows:

```
              # Utility functions
└── app.js           # Entry point of the application
└── package.json           # The dependencies are stored there
```

## Contributing

Contributions are welcome! If you have any suggestions or find any issues, please create an issue or submit a pull request.
