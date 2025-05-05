// API base URL - change this to match your backend server address
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Generic fetch function for API requests
async function fetchAPI<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    // Remove credentials to avoid CORS preflight issues
    // credentials: 'include',
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    console.log(`Making ${method} request to ${url}`, data ? { data } : '');
    
    const response = await fetch(url, options);
    console.log(`Response status: ${response.status}`);
    
    const responseData = await response.json();
    console.log('Response data:', responseData);
    
    if (!response.ok) {
      throw new Error(responseData.message || responseData.error || `API error: ${response.status}`);
    }
    
    return responseData;
  } catch (error) {
    console.error(`Error in ${method} request to ${url}:`, error);
    if (error instanceof TypeError && error.message.includes('NetworkError')) {
      console.error('Network error: Is the server running?');
    }
    throw error;
  }
}

// Students API
export const studentsAPI = {
  getAll: () => fetchAPI<any>('/students'),
  getById: (id: string) => fetchAPI<any>(`/students/${id}`),
  create: (data: any) => fetchAPI<any>('/students', 'POST', data),
  update: (id: string, data: any) => fetchAPI<any>(`/students/${id}`, 'PUT', data),
  delete: (id: string) => fetchAPI<any>(`/students/${id}`, 'DELETE'),
};

// Courses API
export const coursesAPI = {
  getAll: () => fetchAPI<any>('/courses'),
  getById: (id: string) => fetchAPI<any>(`/courses/${id}`),
  create: (data: any) => fetchAPI<any>('/courses', 'POST', data),
  update: (id: string, data: any) => fetchAPI<any>(`/courses/${id}`, 'PUT', data),
  delete: (id: string) => fetchAPI<any>(`/courses/${id}`, 'DELETE'),
  enrollStudent: (courseId: string, studentId: string) => 
    fetchAPI<any>(`/courses/${courseId}/enroll/${studentId}`, 'POST'),
  removeStudent: (courseId: string, studentId: string) => 
    fetchAPI<any>(`/courses/${courseId}/enroll/${studentId}`, 'DELETE'),
};

// Departments API
export const departmentsAPI = {
  getAll: async () => {
    const response = await fetchAPI<any>('/departments');
    return response.data || [];
  },
  getById: (id: string) => fetchAPI<any>(`/departments/${id}`),
  create: (data: any) => fetchAPI<any>('/departments', 'POST', data),
  update: (id: string, data: any) => fetchAPI<any>(`/departments/${id}`, 'PUT', data),
  delete: (id: string) => fetchAPI<any>(`/departments/${id}`, 'DELETE'),
  
  // Additional methods for filtering
  filter: async (params: any) => {
    const queryParams = new URLSearchParams();
    
    if (params.code) queryParams.append('code', params.code);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    
    const endpoint = `/departments?${queryParams.toString()}`;
    const response = await fetchAPI<any>(endpoint);
    return response;
  },
  
  // Add faculty to department
  addFaculty: (departmentId: string, facultyId: string) => 
    fetchAPI<any>(`/departments/${departmentId}/faculty/${facultyId}`, 'POST')
};

// Faculty API
export const facultyAPI = {
  getAll: () => fetchAPI<any>('/faculty'),
  getById: (id: string) => fetchAPI<any>(`/faculty/${id}`),
  create: (data: any) => fetchAPI<any>('/faculty', 'POST', data),
  update: (id: string, data: any) => fetchAPI<any>(`/faculty/${id}`, 'PUT', data),
  delete: (id: string) => fetchAPI<any>(`/faculty/${id}`, 'DELETE'),
};

// Announcements API
export const announcementsAPI = {
  getAll: async () => {
    const response = await fetchAPI<any>('/announcements');
    return response.data || [];
  },
  getById: (id: string) => fetchAPI<any>(`/announcements/${id}`),
  create: (data: any) => fetchAPI<any>('/announcements', 'POST', data),
  update: (id: string, data: any) => fetchAPI<any>(`/announcements/${id}`, 'PUT', data),
  delete: (id: string) => fetchAPI<any>(`/announcements/${id}`, 'DELETE'),
  
  // Additional methods for filtering
  filter: async (params: any) => {
    const queryParams = new URLSearchParams();
    
    if (params.type) queryParams.append('type', params.type);
    if (params.audience) queryParams.append('audience', params.audience);
    if (params.department) queryParams.append('department', params.department);
    if (params.featured !== undefined) queryParams.append('featured', params.featured.toString());
    if (params.urgent !== undefined) queryParams.append('urgent', params.urgent.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const endpoint = `/announcements?${queryParams.toString()}`;
    const response = await fetchAPI<any>(endpoint);
    return response;
  }
};

// Examinations API
export const examinationsAPI = {
  getAll: async () => {
    const response = await fetchAPI<any>('/examinations');
    return response.data || [];
  },
  getById: (id: string) => fetchAPI<any>(`/examinations/${id}`),
  create: (data: any) => fetchAPI<any>('/examinations', 'POST', data),
  update: (id: string, data: any) => fetchAPI<any>(`/examinations/${id}`, 'PUT', data),
  delete: (id: string) => fetchAPI<any>(`/examinations/${id}`, 'DELETE'),
};

// Other APIs can be added here as needed

export default {
  students: studentsAPI,
  courses: coursesAPI,
  departments: departmentsAPI,
  faculty: facultyAPI,
  announcements: announcementsAPI,
  examinations: examinationsAPI,
}; 