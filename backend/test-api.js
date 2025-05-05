const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testDepartment = {
  name: 'Computer Science',
  code: 'CS',
  description: 'Department of Computer Science and Engineering',
  headOfDepartment: 'Dr. John Smith',
  establishedDate: new Date('2000-01-01'),
  contact: {
    email: 'cs@university.edu',
    phone: '123-456-7890',
    office: 'CS Building, Room 101'
  }
};

const testStudent = {
  name: 'Jane Doe',
  email: 'jane.doe@university.edu',
  studentId: 'S12345',
  enrollmentDate: new Date(),
  department: 'CS',
  contactNumber: '987-654-3210',
  address: '123 University St, College Town, CT 12345',
  dateOfBirth: new Date('2000-05-15'),
  gender: 'Female'
};

const testCourse = {
  courseCode: 'CS101',
  name: 'Introduction to Programming',
  description: 'Fundamentals of programming using JavaScript',
  department: 'CS',
  credits: 3,
  instructor: 'Dr. Jane Smith',
  schedule: {
    days: ['Monday', 'Wednesday'],
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    location: 'CS Building, Room 201'
  },
  maxCapacity: 30
};

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

// Test API endpoints
async function runTests() {
  console.log('Testing University Management API...');
  console.log('---------------------------------');

  // Test health endpoint
  console.log('1. Testing API health endpoint...');
  const healthResponse = await apiRequest('/health');
  console.log(`Status: ${healthResponse.status}`);
  console.log('Response:', healthResponse.data);
  console.log('---------------------------------');

  // Create a student
  console.log('2. Creating a test student...');
  const createStudentResponse = await apiRequest('/students', 'POST', testStudent);
  console.log(`Status: ${createStudentResponse.status}`);
  console.log('Response:', createStudentResponse.data);
  console.log('---------------------------------');

  // Get all students
  console.log('3. Getting all students...');
  const getStudentsResponse = await apiRequest('/students');
  console.log(`Status: ${getStudentsResponse.status}`);
  console.log(`Found ${getStudentsResponse.data.count} students`);
  console.log('---------------------------------');

  // Create a course
  console.log('4. Creating a test course...');
  const createCourseResponse = await apiRequest('/courses', 'POST', testCourse);
  console.log(`Status: ${createCourseResponse.status}`);
  console.log('Response:', createCourseResponse.data);
  console.log('---------------------------------');

  // Get all courses
  console.log('5. Getting all courses...');
  const getCoursesResponse = await apiRequest('/courses');
  console.log(`Status: ${getCoursesResponse.status}`);
  console.log(`Found ${getCoursesResponse.data.count} courses`);
  console.log('---------------------------------');

  // Enroll student in course (if both were created successfully)
  if (createStudentResponse.status === 201 && createCourseResponse.status === 201) {
    console.log('6. Enrolling student in course...');
    const studentId = testStudent.studentId;
    const courseId = testCourse.courseCode;
    const enrollResponse = await apiRequest(`/courses/${courseId}/enroll/${studentId}`, 'POST');
    console.log(`Status: ${enrollResponse.status}`);
    console.log('Response:', enrollResponse.data);
    console.log('---------------------------------');
  }

  console.log('API Tests completed!');
}

// Run the tests
runTests().catch(console.error); 