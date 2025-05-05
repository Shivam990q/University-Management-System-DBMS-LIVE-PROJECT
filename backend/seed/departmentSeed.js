const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// MongoDB connection string
const uri = process.env.MONGODB_URI;

console.log('Using MongoDB URI:', uri ? 'URI found in .env' : 'URI not found');

if (!uri) {
  console.error('MongoDB URI is not defined in .env file');
  process.exit(1);
}

const sampleDepartments = [
  {
    name: 'Computer Science and Engineering',
    code: 'CSE',
    established: '1995',
    hod: 'Dr. Rajiv Sharma',
    hodEmail: 'rajiv.sharma@itmu.edu',
    students: 650,
    faculty: 28,
    courses: 32,
    programs: ['B.Tech', 'M.Tech', 'Ph.D'],
    description: 'The Department of Computer Science and Engineering is focused on developing innovative computing solutions to real-world problems. The department offers undergraduate, graduate, and doctoral programs in Computer Science and Engineering.',
    location: 'Tech Building A, 2nd Floor',
    contact: '+91-123-4567890',
    email: 'cse@itmu.edu',
    website: 'https://itmu.edu/cse',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Electronics and Communication Engineering',
    code: 'ECE',
    established: '1992',
    hod: 'Dr. Priya Singh',
    hodEmail: 'priya.singh@itmu.edu',
    students: 580,
    faculty: 24,
    courses: 28,
    programs: ['B.Tech', 'M.Tech', 'Ph.D'],
    description: 'The Department of Electronics and Communication Engineering delivers education in the field of electronics, communications, and related areas. The department emphasizes both theoretical concepts and practical applications.',
    location: 'Tech Building B, 1st Floor',
    contact: '+91-123-4567891',
    email: 'ece@itmu.edu',
    website: 'https://itmu.edu/ece',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Mechanical Engineering',
    code: 'ME',
    established: '1990',
    hod: 'Dr. Ashok Kumar',
    hodEmail: 'ashok.kumar@itmu.edu',
    students: 520,
    faculty: 22,
    courses: 26,
    programs: ['B.Tech', 'M.Tech', 'Ph.D'],
    description: 'The Department of Mechanical Engineering provides education in thermal engineering, design engineering, manufacturing engineering, and industrial engineering. The department has well-equipped laboratories for research and education.',
    location: 'Engineering Block C, Ground Floor',
    contact: '+91-123-4567892',
    email: 'me@itmu.edu',
    website: 'https://itmu.edu/me',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Electrical Engineering',
    code: 'EE',
    established: '1991',
    hod: 'Dr. Meena Tiwari',
    hodEmail: 'meena.tiwari@itmu.edu',
    students: 490,
    faculty: 20,
    courses: 24,
    programs: ['B.Tech', 'M.Tech', 'Ph.D'],
    description: 'The Department of Electrical Engineering offers comprehensive education in power systems, control systems, and electrical machines. The department has strong industry connections and research collaborations.',
    location: 'Tech Building B, 3rd Floor',
    contact: '+91-123-4567893',
    email: 'ee@itmu.edu',
    website: 'https://itmu.edu/ee',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Civil Engineering',
    code: 'CE',
    established: '1989',
    hod: 'Dr. Vijay Reddy',
    hodEmail: 'vijay.reddy@itmu.edu',
    students: 420,
    faculty: 18,
    courses: 22,
    programs: ['B.Tech', 'M.Tech', 'Ph.D'],
    description: 'The Department of Civil Engineering provides education in structural engineering, transportation engineering, geotechnical engineering, and environmental engineering. The department has state-of-the-art laboratories and research facilities.',
    location: 'Engineering Block A, Ground Floor',
    contact: '+91-123-4567894',
    email: 'ce@itmu.edu',
    website: 'https://itmu.edu/ce',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Management Studies',
    code: 'MS',
    established: '2000',
    hod: 'Dr. Neha Kapoor',
    hodEmail: 'neha.kapoor@itmu.edu',
    students: 380,
    faculty: 16,
    courses: 20,
    programs: ['BBA', 'MBA', 'Ph.D'],
    description: 'The Department of Management Studies offers business education with specializations in marketing, finance, human resources, and operations management. The department emphasizes case-based learning and industry exposure.',
    location: 'Management Building, 1st Floor',
    contact: '+91-123-4567895',
    email: 'ms@itmu.edu',
    website: 'https://itmu.edu/ms',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Physics',
    code: 'PHY',
    established: '1988',
    hod: 'Dr. Arun Mishra',
    hodEmail: 'arun.mishra@itmu.edu',
    students: 210,
    faculty: 14,
    courses: 18,
    programs: ['B.Sc', 'M.Sc', 'Ph.D'],
    description: 'The Department of Physics is involved in teaching and research in various fields of physics including condensed matter physics, optics, and quantum mechanics. The department has well-equipped laboratories for experimental physics.',
    location: 'Science Block, 2nd Floor',
    contact: '+91-123-4567896',
    email: 'physics@itmu.edu',
    website: 'https://itmu.edu/physics',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Chemistry',
    code: 'CHEM',
    established: '1988',
    hod: 'Dr. Sunita Gupta',
    hodEmail: 'sunita.gupta@itmu.edu',
    students: 200,
    faculty: 12,
    courses: 16,
    programs: ['B.Sc', 'M.Sc', 'Ph.D'],
    description: 'The Department of Chemistry offers education and research opportunities in organic chemistry, inorganic chemistry, and physical chemistry. The department has modern laboratory facilities for teaching and research.',
    location: 'Science Block, 3rd Floor',
    contact: '+91-123-4567897',
    email: 'chemistry@itmu.edu',
    website: 'https://itmu.edu/chemistry',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedDepartments() {
  let client;
  
  try {
    console.log('Attempting to connect to MongoDB...');
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    const database = client.db();
    console.log(`Connected to database: ${database.databaseName}`);
    
    const departmentsCollection = database.collection('departments');
    console.log('Accessing departments collection');
    
    // Check if collection is empty
    const count = await departmentsCollection.countDocuments();
    console.log(`Current department count: ${count}`);
    
    if (count > 0) {
      console.log('Departments collection already has data. Skipping seed.');
      return;
    }
    
    // Insert sample departments
    console.log(`Inserting ${sampleDepartments.length} department records...`);
    const result = await departmentsCollection.insertMany(sampleDepartments);
    console.log(`Success: ${result.insertedCount} departments inserted successfully`);
    
  } catch (error) {
    console.error('Error seeding departments:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the seed function
console.log('Starting department seed process...');
seedDepartments()
  .then(() => console.log('Seeding completed'))
  .catch(err => console.error('Seeding failed:', err)); 