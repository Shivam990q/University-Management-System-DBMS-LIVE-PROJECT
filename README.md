# University Management System

A comprehensive web-based University Management System built with the MERN stack (MongoDB, Express, React, Node.js). This system helps educational institutions manage students, faculty, courses, departments, examinations, and announcements through an intuitive dashboard interface.

## Features

- **Student Management**: Add, edit, view student profiles, track admissions and attendance
- **Faculty Management**: Manage faculty information and assignments
- **Course Management**: Create, assign, and schedule courses
- **Department Management**: Organize academic departments and view department-specific data
- **Examination System**: Schedule and manage examinations
- **Announcements**: Create and distribute important announcements
- **Dashboard**: Visualize key metrics and statistics
- **Responsive UI**: Modern interface that works on desktop and mobile devices

## Tech Stack

### Frontend
- React with TypeScript (87.5%)
- Vite for build tooling
- React Router for navigation
- TanStack Query for data fetching
- Shadcn UI & Tailwind CSS for styling
- Recharts for data visualization

### Backend
- Node.js with Express (JavaScript 12.1%)
- MongoDB for database
- RESTful API architecture
- Proper error handling and connection management

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shivam990q/University-Management-System-DBMS-LIVE-PROJECT.git
   cd University-Management-System-DBMS-LIVE-PROJECT
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create a .env file with your MongoDB connection string
   echo "MONGODB_URI=your_mongodb_connection_string" > .env
   
   # Start the backend server
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   
   # Start the frontend development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Deployment (Render.com)

### Backend Deployment
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add Environment Variables (including MONGODB_URI)

### Frontend Deployment
1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Configure the service:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Add Environment Variable: `VITE_API_URL=your_backend_url`

## Project Structure

```
University-Management-System-DBMS-LIVE-PROJECT/
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Application pages
│   │   ├── lib/                # Utility functions
│   │   ├── hooks/              # Custom React hooks
│   │   └── App.tsx             # Main application component
│   ├── package.json            # Frontend dependencies
│   └── vite.config.ts          # Vite configuration
│
├── backend/                    # Node.js backend API
│   ├── controllers/            # Route controllers
│   ├── models/                 # MongoDB data models
│   ├── routes/                 # API routes
│   ├── config/                 # Configuration files
│   ├── server.js               # Main server file
│   └── package.json            # Backend dependencies
```

## API Endpoints

- `/api/students` - Student management
- `/api/courses` - Course management
- `/api/departments` - Department management
- `/api/examinations` - Examination management
- `/api/announcements` - Announcement management
- `/api/health` - API health check

## Future Enhancements

- User authentication and role-based access control
- Assignment submission system
- Grading system
- Calendar integration
- Mobile application

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

- [Shivam990q](https://github.com/Shivam990q) - Repository Owner
- [thedev-elites](https://github.com/thedev-elites) - Development Team 