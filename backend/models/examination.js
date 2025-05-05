const { MongoClient } = require('mongodb');

/**
 * Initialize Examination collection
 * @param {MongoClient} db - MongoDB Database instance
 */
const initExaminationCollection = async (db) => {
  // Check if collection already exists
  const collections = await db.listCollections({ name: 'examinations' }).toArray();
  
  if (collections.length === 0) {
    console.log('Creating examinations collection...');
    const examinations = await db.createCollection('examinations', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['title', 'type', 'startDate', 'endDate', 'duration', 'maxMarks'],
          properties: {
            title: { bsonType: 'string' },
            type: { bsonType: 'string' },
            academicTerm: { bsonType: 'string' },
            department: { bsonType: 'string' },
            courses: { bsonType: 'array' },
            startDate: { bsonType: 'date' },
            endDate: { bsonType: 'date' },
            duration: { bsonType: 'int' },
            venue: { bsonType: 'string' },
            maxMarks: { bsonType: 'int' },
            passingMarks: { bsonType: 'int' },
            instructions: { bsonType: 'string' },
            proctored: { bsonType: 'bool' },
            allowCalculator: { bsonType: 'bool' },
            allowBooks: { bsonType: 'bool' },
            allowNotes: { bsonType: 'bool' },
            onlineExam: { bsonType: 'bool' },
            status: { bsonType: 'string' },
            createdAt: { bsonType: 'date' }
          }
        }
      }
    });
    
    console.log('Examinations collection created');
    return examinations;
  } else {
    console.log('Examinations collection already exists');
    return db.collection('examinations');
  }
};

module.exports = { initExaminationCollection }; 