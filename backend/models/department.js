const { ObjectId } = require('mongodb');

// Department schema for validation
const departmentSchema = {
  name: { type: 'string', required: true },
  code: { type: 'string', required: true, unique: true },
  description: { type: 'string' },
  headOfDepartment: { type: 'string' },
  faculty: { type: 'array', default: [] },
  courses: { type: 'array', default: [] },
  establishedDate: { type: 'date' },
  contact: {
    email: { type: 'string' },
    phone: { type: 'string' },
    office: { type: 'string' }
  },
  status: { type: 'string', default: 'active' }
};

// Department collection initialization
const initDepartmentCollection = async (db) => {
  try {
    const collections = await db.listCollections({ name: 'departments' }).toArray();
    
    if (collections.length === 0) {
      await db.createCollection('departments');
      console.log("Departments collection created");
      
      // Create indexes
      await db.collection('departments').createIndex({ code: 1 }, { unique: true });
    }
    
    return db.collection('departments');
  } catch (error) {
    console.error('Error initializing department collection:', error);
    throw error;
  }
};

module.exports = { departmentSchema, initDepartmentCollection }; 