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

const sampleStudents = [
  {
    name: "Rahul Sharma",
    studentId: "ITMU2025001",
    email: "rahul.sharma@student.itmu.edu",
    department: "Computer Science and Engineering",
    program: "B.Tech",
    enrollmentDate: new Date("2022-08-15"),
    status: "active",
    contactNumber: "+91-9876543210",
    address: "123 College Road, Bangalore",
    dateOfBirth: new Date("2004-05-12"),
    gender: "male",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Priya Patel",
    studentId: "ITMU2025002",
    email: "priya.patel@student.itmu.edu",
    department: "Electronics and Communication Engineering",
    program: "B.Tech",
    enrollmentDate: new Date("2022-08-15"),
    status: "active",
    contactNumber: "+91-9876543211",
    address: "456 University Street, Mumbai",
    dateOfBirth: new Date("2004-07-18"),
    gender: "female",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Aditya Singh",
    studentId: "ITMU2025003",
    email: "aditya.singh@student.itmu.edu",
    department: "Mechanical Engineering",
    program: "B.Tech",
    enrollmentDate: new Date("2022-08-16"),
    status: "active",
    contactNumber: "+91-9876543212",
    address: "789 Campus Avenue, Delhi",
    dateOfBirth: new Date("2004-03-25"),
    gender: "male",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Sneha Gupta",
    studentId: "ITMU2025004",
    email: "sneha.gupta@student.itmu.edu",
    department: "Management Studies",
    program: "BBA",
    enrollmentDate: new Date("2022-08-16"),
    status: "active",
    contactNumber: "+91-9876543213",
    address: "234 College Lane, Chennai",
    dateOfBirth: new Date("2004-11-08"),
    gender: "female",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Vikram Yadav",
    studentId: "ITMU2025005",
    email: "vikram.yadav@student.itmu.edu",
    department: "Civil Engineering",
    program: "B.Tech",
    enrollmentDate: new Date("2022-08-17"),
    status: "active",
    contactNumber: "+91-9876543214",
    address: "567 University Road, Hyderabad",
    dateOfBirth: new Date("2004-01-15"),
    gender: "male",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Neha Kapoor",
    studentId: "ITMU2025006",
    email: "neha.kapoor@student.itmu.edu",
    department: "Architecture",
    program: "B.Arch",
    enrollmentDate: new Date("2022-08-17"),
    status: "inactive",
    contactNumber: "+91-9876543215",
    address: "890 Campus Street, Pune",
    dateOfBirth: new Date("2003-09-20"),
    gender: "female",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Rajat Verma",
    studentId: "ITMU2025007",
    email: "rajat.verma@student.itmu.edu",
    department: "Computer Science and Engineering",
    program: "M.Tech",
    enrollmentDate: new Date("2023-08-15"),
    status: "active",
    contactNumber: "+91-9876543216",
    address: "123 Graduate Housing, Bangalore",
    dateOfBirth: new Date("2000-06-12"),
    gender: "male",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Ananya Joshi",
    studentId: "ITMU2025008",
    email: "ananya.joshi@student.itmu.edu",
    department: "Management Studies",
    program: "MBA",
    enrollmentDate: new Date("2023-08-15"),
    status: "active",
    contactNumber: "+91-9876543217",
    address: "456 Business School Road, Mumbai",
    dateOfBirth: new Date("1999-12-04"),
    gender: "female",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Arjun Malhotra",
    studentId: "ITMU2025009",
    email: "arjun.malhotra@student.itmu.edu",
    department: "Electrical Engineering",
    program: "B.Tech",
    enrollmentDate: new Date("2022-08-18"),
    status: "active",
    contactNumber: "+91-9876543218",
    address: "789 Engineering Block, Delhi",
    dateOfBirth: new Date("2004-04-30"),
    gender: "male",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Kavita Reddy",
    studentId: "ITMU2025010",
    email: "kavita.reddy@student.itmu.edu",
    department: "Physics",
    program: "B.Sc",
    enrollmentDate: new Date("2022-08-18"),
    status: "suspended",
    contactNumber: "+91-9876543219",
    address: "234 Science Block, Chennai",
    dateOfBirth: new Date("2003-07-22"),
    gender: "female",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedStudents() {
  let client;
  
  try {
    console.log('Attempting to connect to MongoDB...');
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    const database = client.db();
    console.log(`Connected to database: ${database.databaseName}`);
    
    const studentsCollection = database.collection('students');
    console.log('Accessing students collection');
    
    // Check if collection is empty
    const count = await studentsCollection.countDocuments();
    console.log(`Current student count: ${count}`);
    
    if (count > 0) {
      console.log('Students collection already has data. Skipping seed.');
      return;
    }
    
    // Insert sample students
    console.log(`Inserting ${sampleStudents.length} student records...`);
    const result = await studentsCollection.insertMany(sampleStudents);
    console.log(`Success: ${result.insertedCount} students inserted successfully`);
    
  } catch (error) {
    console.error('Error seeding students:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the seed function
console.log('Starting student seed process...');
seedStudents()
  .then(() => console.log('Seeding completed'))
  .catch(err => console.error('Seeding failed:', err)); 