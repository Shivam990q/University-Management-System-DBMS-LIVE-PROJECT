const { ObjectId } = require('mongodb');

// Faculty schema for validation
const facultySchema = {
  name: { type: 'string', required: true },
  email: { type: 'string', required: true, unique: true },
  facultyId: { type: 'string', required: true, unique: true },
  department: { type: 'string', required: true },
  position: { type: 'string', required: true },
  specialization: { type: 'string' },
  courses: { type: 'array', default: [] },
  contactNumber: { type: 'string' },
  officeLocation: { type: 'string' },
  officeHours: { type: 'string' },
  joiningDate: { type: 'date' },
  qualifications: { type: 'array', default: [] },
  status: { type: 'string', default: 'active' }
};

// Faculty collection initialization
const initFacultyCollection = async (db) => {
  try {
    const collections = await db.listCollections({ name: 'faculty' }).toArray();
    
    if (collections.length === 0) {
      await db.createCollection('faculty');
      console.log("Faculty collection created");
      
      // Create indexes
      await db.collection('faculty').createIndex({ facultyId: 1 }, { unique: true });
      await db.collection('faculty').createIndex({ email: 1 }, { unique: true });
    }
    
    return db.collection('faculty');
  } catch (error) {
    console.error('Error initializing faculty collection:', error);
    throw error;
  }
};

module.exports = { facultySchema, initFacultyCollection }; 