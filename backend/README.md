# University Management System - Backend

This is the backend API for the University Management System, which provides comprehensive functionality to manage students, courses, departments, and faculty members in a university setting.

## Features

- **Complete CRUD Operations** for all major entities:
  - Students
  - Courses
  - Departments
  - Faculty

- **Database Operations**:
  - CREATE: Add new records (INSERT)
  - READ: Fetch records (SELECT)
  - UPDATE: Modify existing records (UPDATE)  
  - DELETE: Remove records (DELETE)

- **Advanced Features**:
  - Course enrollment system
  - Student-course management
  - Filtering and searching capabilities
  - Secure database connectivity

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework for building the RESTful API
- **MongoDB**: NoSQL database for storing university data
- **MongoDB Atlas**: Cloud database service

## API Endpoints

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get a specific student by ID or student ID
- `POST /api/students` - Create a new student
- `PUT /api/students/:id` - Update a student
- `DELETE /api/students/:id` - Delete a student

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get a specific course by ID or course code
- `POST /api/courses` - Create a new course
- `PUT /api/courses/:id` - Update a course
- `DELETE /api/courses/:id` - Delete a course
- `POST /api/courses/:courseId/enroll/:studentId` - Enroll a student in a course
- `DELETE /api/courses/:courseId/enroll/:studentId` - Remove a student from a course

## Setup Instructions

1. **Install dependencies**:
   ```
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

3. **Run the server**:
   ```
   npm start
   ```
   
   For development with automatic reloading:
   ```
   npm run dev
   ```

4. **Test the API**:
   ```
   node test-api.js
   ```

## Database Schema

The system uses the following collections:

1. **students**: Manage student records
2. **courses**: Manage course offerings
3. **departments**: Manage academic departments
4. **faculty**: Manage faculty members

Each collection has appropriate indexes and validation to ensure data integrity.

## Demonstration

This backend system demonstrates full database operations (CRUD) and can be integrated with any frontend application to create a complete university management solution. 