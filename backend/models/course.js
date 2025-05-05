const { ObjectId } = require('mongodb');

// Course schema for validation
const courseSchema = {
  courseCode: { type: 'string', required: true, unique: true },
  name: { type: 'string', required: true },
  description: { type: 'string' },
  department: { type: 'string', required: true },
  credits: { type: 'number', required: true },
  instructor: { type: 'string' },
  schedule: {
    days: { type: 'array' },
    startTime: { type: 'string' },
    endTime: { type: 'string' },
    location: { type: 'string' }
  },
  maxCapacity: { type: 'number', default: 30 },
  enrolledStudents: { type: 'array', default: [] },
  status: { type: 'string', default: 'active' },
};

// Course collection initialization
const initCourseCollection = async (db) => {
  try {
    const collections = await db.listCollections({ name: 'courses' }).toArray();
    
    if (collections.length === 0) {
      await db.createCollection('courses');
      console.log("Courses collection created");
      
      // Create indexes
      await db.collection('courses').createIndex({ courseCode: 1 }, { unique: true });
    }
    
    return db.collection('courses');
  } catch (error) {
    console.error('Error initializing course collection:', error);
    throw error;
  }
};

module.exports = { courseSchema, initCourseCollection }; 