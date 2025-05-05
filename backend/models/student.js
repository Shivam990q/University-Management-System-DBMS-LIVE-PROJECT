const { ObjectId } = require('mongodb');

// Student schema for validation
const studentSchema = {
  name: { type: 'string', required: true },
  email: { type: 'string', required: true, unique: true },
  studentId: { type: 'string', required: true, unique: true },
  enrollmentDate: { type: 'date', required: true },
  department: { type: 'string', required: true },
  courses: { type: 'array', default: [] },
  contactNumber: { type: 'string' },
  address: { type: 'string' },
  dateOfBirth: { type: 'date' },
  gender: { type: 'string' },
  status: { type: 'string', default: 'active' },
};

// Student collection initialization
const initStudentCollection = async (db) => {
  try {
    const collections = await db.listCollections({ name: 'students' }).toArray();
    
    if (collections.length === 0) {
      await db.createCollection('students');
      console.log("Students collection created");
      
      // Create indexes
      await db.collection('students').createIndex({ studentId: 1 }, { unique: true });
      await db.collection('students').createIndex({ email: 1 }, { unique: true });
    }
    
    return db.collection('students');
  } catch (error) {
    console.error('Error initializing student collection:', error);
    throw error;
  }
};

module.exports = { studentSchema, initStudentCollection }; 