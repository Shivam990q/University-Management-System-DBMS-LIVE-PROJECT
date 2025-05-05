const express = require('express');
const cors = require('cors');
const { connectDB, client } = require('./config/db');
const { initStudentCollection } = require('./models/student');
const { initCourseCollection } = require('./models/course');
const { initDepartmentCollection } = require('./models/department');
const { initFacultyCollection } = require('./models/faculty');
const { initExaminationCollection } = require('./models/examination');
const { initAnnouncementCollection } = require('./models/announcement');

const studentController = require('./controllers/studentController');
const courseController = require('./controllers/courseController');
const departmentController = require('./controllers/departmentController');
const examinationController = require('./controllers/examinationController');
const announcementController = require('./controllers/announcementController');

// Import routes
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const examinationRoutes = require('./routes/examinationRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:8081', 'http://localhost:5173', 'https://university-management-system-dbms-live-uyvc.onrender.com'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Initialize database and collections
let db;

const initializeDB = async () => {
  try {
    // Connect to MongoDB
    db = await connectDB();
    
    // Initialize collections
    const studentsCollection = await initStudentCollection(db);
    const coursesCollection = await initCourseCollection(db);
    const departmentsCollection = await initDepartmentCollection(db);
    const facultyCollection = await initFacultyCollection(db);
    const examinationsCollection = await initExaminationCollection(db);
    const announcementsCollection = await initAnnouncementCollection(db);
    
    // Initialize controllers with collections
    studentController.initController(studentsCollection);
    courseController.initController(coursesCollection);
    departmentController.initController(departmentsCollection);
    examinationController.initController(examinationsCollection);
    announcementController.initController(announcementsCollection);
    
    console.log('Database collections initialized');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/examinations', examinationRoutes);
app.use('/api/announcements', announcementRoutes);

// Server health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'University Management API is running',
    time: new Date().toISOString()
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start the server
const startServer = async () => {
  try {
    await initializeDB();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

// Handle server shutdown gracefully
process.on('SIGINT', async () => {
  console.log('Server shutting down...');
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

startServer(); 