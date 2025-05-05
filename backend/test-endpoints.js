const http = require('http');

// Function to make an HTTP request and return a promise
function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`${options.method} ${options.path} - Status: ${res.statusCode}`);
        try {
          const jsonData = JSON.parse(data);
          console.log('Response:', JSON.stringify(jsonData, null, 2));
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          console.log('Response:', data);
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', (error) => {
      console.error(`Error with ${options.method} request to ${options.path}:`, error.message);
      reject(error);
    });

    if (options.data) {
      req.write(JSON.stringify(options.data));
    }

    req.end();
  });
}

// Base options for all requests
const baseOptions = {
  hostname: 'localhost',
  port: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Test the health endpoint
async function testHealthEndpoint() {
  console.log('\n1. Testing API health endpoint...');
  const options = {
    ...baseOptions,
    path: '/api/health',
    method: 'GET',
  };
  
  return makeRequest(options);
}

// Test creating an announcement
async function testCreateAnnouncement() {
  console.log('\n2. Testing create announcement endpoint...');
  const announcementData = {
    title: 'Test Announcement',
    content: 'This is a test announcement created via API',
    type: 'general',
    audience: 'all',
    urgent: false,
    featured: false,
  };
  
  const options = {
    ...baseOptions,
    path: '/api/announcements',
    method: 'POST',
    data: announcementData,
  };
  
  return makeRequest(options);
}

// Test getting all announcements
async function testGetAnnouncements() {
  console.log('\n3. Testing get all announcements endpoint...');
  const options = {
    ...baseOptions,
    path: '/api/announcements',
    method: 'GET',
  };
  
  return makeRequest(options);
}

// Test creating an examination
async function testCreateExamination() {
  console.log('\n4. Testing create examination endpoint...');
  const examinationData = {
    title: 'Test Examination',
    type: 'midterm',
    academicTerm: 'Fall 2023',
    department: 'computer-science',
    courses: [],
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
    duration: 60,
    maxMarks: 100,
    passingMarks: 40,
    venue: 'Test Venue',
    instructions: 'Test instructions',
    proctored: true,
    status: 'scheduled'
  };
  
  const options = {
    ...baseOptions,
    path: '/api/examinations',
    method: 'POST',
    data: examinationData,
  };
  
  return makeRequest(options);
}

// Test getting all examinations
async function testGetExaminations() {
  console.log('\n5. Testing get all examinations endpoint...');
  const options = {
    ...baseOptions,
    path: '/api/examinations',
    method: 'GET',
  };
  
  return makeRequest(options);
}

// Run all tests
async function runTests() {
  console.log('Testing University Management API Endpoints...');
  console.log('-------------------------------------------------');
  
  try {
    await testHealthEndpoint();
    const createAnnouncementResult = await testCreateAnnouncement();
    await testGetAnnouncements();
    const createExaminationResult = await testCreateExamination();
    await testGetExaminations();
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test suite failed:', error.message);
  }
}

// Run the tests
runTests(); 