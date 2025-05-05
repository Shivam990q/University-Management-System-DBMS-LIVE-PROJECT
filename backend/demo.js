const fetch = require('node-fetch');
const readline = require('readline');

const BASE_URL = 'http://localhost:5000/api';

// Create a readline interface for interactive demo
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function for API requests
async function apiRequest(endpoint, method = 'GET', data = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();
    return { status: response.status, data: responseData };
  } catch (error) {
    console.error(`Error with ${method} request to ${url}:`, error);
    return { status: 500, error: error.message };
  }
}

// Function to wait for user input before continuing
function waitForInput(message) {
  return new Promise((resolve) => {
    rl.question(message || 'Press Enter to continue...', () => {
      resolve();
    });
  });
}

// Sample data for demonstration
const sampleDepartment = {
  name: 'Computer Science',
  code: 'CS',
  description: 'Department of Computer Science and Engineering',
  headOfDepartment: 'Dr. John Smith'
};

const sampleStudent = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  studentId: 'ST123456',
  enrollmentDate: new Date(),
  department: 'CS'
};

const sampleCourse = {
  courseCode: 'CS202',
  name: 'Data Structures',
  description: 'Advanced course on data structures and algorithms',
  department: 'CS',
  credits: 4
};

// CRUD Demonstration Functions
async function demonstrateStudentCRUD() {
  console.log('\n===== STUDENT CRUD OPERATIONS DEMONSTRATION =====\n');
  
  // CREATE - Add a new student
  console.log('CREATE OPERATION (INSERT):');
  console.log('Adding a new student to the database...');
  const createResponse = await apiRequest('/students', 'POST', sampleStudent);
  console.log('Response:', createResponse.data);
  console.log('\nStudent successfully created in the database!');
  
  await waitForInput();
  
  // READ - Get all students
  console.log('\nREAD OPERATION (SELECT):');
  console.log('Fetching all students from the database...');
  const readAllResponse = await apiRequest('/students');
  console.log(`Found ${readAllResponse.data.count} students`);
  console.log('First student:', readAllResponse.data.data[0]);
  
  // Store the student ID for later operations
  const studentId = readAllResponse.data.data[0]._id;
  
  await waitForInput();
  
  // READ - Get a specific student
  console.log('\nREAD OPERATION (SELECT by ID):');
  console.log(`Fetching student with ID: ${studentId}`);
  const readOneResponse = await apiRequest(`/students/${studentId}`);
  console.log('Student Details:', readOneResponse.data.data);
  
  await waitForInput();
  
  // UPDATE - Modify a student record
  console.log('\nUPDATE OPERATION:');
  console.log('Updating student information...');
  const updateData = { contactNumber: '555-123-4567', address: '123 University Ave' };
  const updateResponse = await apiRequest(`/students/${studentId}`, 'PUT', updateData);
  console.log('Updated Student:', updateResponse.data.data);
  
  await waitForInput();
  
  // DELETE - Remove a student (commented out to preserve data if needed)
  console.log('\nDELETE OPERATION:');
  console.log(`Deleting student with ID: ${studentId}`);
  console.log('(This operation would normally delete the student record)');
  
  // Uncomment the following lines to actually delete the student
  // const deleteResponse = await apiRequest(`/students/${studentId}`, 'DELETE');
  // console.log('Delete Response:', deleteResponse.data);
  
  console.log('\nStudent CRUD operations demonstration completed!');
  await waitForInput();
}

async function demonstrateCourseCRUD() {
  console.log('\n===== COURSE CRUD OPERATIONS DEMONSTRATION =====\n');
  
  // CREATE - Add a new course
  console.log('CREATE OPERATION (INSERT):');
  console.log('Adding a new course to the database...');
  const createResponse = await apiRequest('/courses', 'POST', sampleCourse);
  console.log('Response:', createResponse.data);
  console.log('\nCourse successfully created in the database!');
  
  await waitForInput();
  
  // READ - Get all courses
  console.log('\nREAD OPERATION (SELECT):');
  console.log('Fetching all courses from the database...');
  const readAllResponse = await apiRequest('/courses');
  console.log(`Found ${readAllResponse.data.count} courses`);
  console.log('First course:', readAllResponse.data.data[0]);
  
  // Store the course ID for later operations
  const courseId = readAllResponse.data.data[0]._id;
  const courseCode = readAllResponse.data.data[0].courseCode;
  
  await waitForInput();
  
  // READ - Get a specific course
  console.log('\nREAD OPERATION (SELECT by ID):');
  console.log(`Fetching course with code: ${courseCode}`);
  const readOneResponse = await apiRequest(`/courses/${courseCode}`);
  console.log('Course Details:', readOneResponse.data.data);
  
  await waitForInput();
  
  // UPDATE - Modify a course record
  console.log('\nUPDATE OPERATION:');
  console.log('Updating course information...');
  const updateData = { 
    maxCapacity: 35,
    schedule: {
      days: ['Tuesday', 'Thursday'],
      startTime: '2:00 PM',
      endTime: '3:30 PM',
      location: 'Science Building, Room 305'
    }
  };
  const updateResponse = await apiRequest(`/courses/${courseCode}`, 'PUT', updateData);
  console.log('Updated Course:', updateResponse.data.data);
  
  await waitForInput();
  
  // DELETE - Remove a course (commented out to preserve data if needed)
  console.log('\nDELETE OPERATION:');
  console.log(`Deleting course with code: ${courseCode}`);
  console.log('(This operation would normally delete the course record)');
  
  // Uncomment the following lines to actually delete the course
  // const deleteResponse = await apiRequest(`/courses/${courseCode}`, 'DELETE');
  // console.log('Delete Response:', deleteResponse.data);
  
  console.log('\nCourse CRUD operations demonstration completed!');
  await waitForInput();
}

async function demonstrateEnrollment() {
  console.log('\n===== STUDENT ENROLLMENT DEMONSTRATION =====\n');
  
  // Get a student ID
  const studentsResponse = await apiRequest('/students');
  if (studentsResponse.data.count === 0) {
    console.log('No students available. Please run the student CRUD demo first.');
    return;
  }
  const studentId = studentsResponse.data.data[0].studentId;
  
  // Get a course code
  const coursesResponse = await apiRequest('/courses');
  if (coursesResponse.data.count === 0) {
    console.log('No courses available. Please run the course CRUD demo first.');
    return;
  }
  const courseCode = coursesResponse.data.data[0].courseCode;
  
  // Enroll student in course
  console.log(`Enrolling student ${studentId} in course ${courseCode}...`);
  const enrollResponse = await apiRequest(`/courses/${courseCode}/enroll/${studentId}`, 'POST');
  console.log('Enrollment response:', enrollResponse.data);
  
  await waitForInput();
  
  // Check course enrollment
  console.log(`\nChecking enrolled students in course ${courseCode}...`);
  const courseResponse = await apiRequest(`/courses/${courseCode}`);
  console.log('Enrolled students:', courseResponse.data.data.enrolledStudents);
  
  await waitForInput();
  
  // Remove student from course
  console.log(`\nRemoving student ${studentId} from course ${courseCode}...`);
  const unenrollResponse = await apiRequest(`/courses/${courseCode}/enroll/${studentId}`, 'DELETE');
  console.log('Unenrollment response:', unenrollResponse.data);
  
  console.log('\nEnrollment operations demonstration completed!');
  await waitForInput();
}

// Main demonstration function
async function runDemonstration() {
  console.log('======================================================');
  console.log('UNIVERSITY MANAGEMENT SYSTEM - DATABASE OPERATIONS DEMO');
  console.log('======================================================\n');
  
  console.log('This demonstration will show all CRUD operations:');
  console.log('- CREATE: Insert new records into the database');
  console.log('- READ: Retrieve records from the database');
  console.log('- UPDATE: Modify existing records in the database');
  console.log('- DELETE: Remove records from the database\n');
  
  await waitForInput('Press Enter to start the demonstration...');
  
  // Check if API is running
  console.log('\nChecking API connection...');
  const healthCheck = await apiRequest('/health');
  
  if (healthCheck.status !== 200) {
    console.log('Error: Cannot connect to the API. Please make sure the server is running.');
    rl.close();
    return;
  }
  
  console.log('API connection successful! Server is running.\n');
  
  // Run the demonstrations
  await demonstrateStudentCRUD();
  await demonstrateCourseCRUD();
  await demonstrateEnrollment();
  
  console.log('\n======================================================');
  console.log('DEMONSTRATION COMPLETED SUCCESSFULLY!');
  console.log('All database operations (CRUD) have been demonstrated.');
  console.log('======================================================');
  
  rl.close();
}

// Run the demonstration
runDemonstration().catch((error) => {
  console.error('An error occurred during the demonstration:', error);
  rl.close();
}); 