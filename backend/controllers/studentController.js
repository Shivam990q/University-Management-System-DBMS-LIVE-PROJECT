const { ObjectId } = require('mongodb');

let studentsCollection;

// Initialize the controller with the database collection
const initController = (collection) => {
  studentsCollection = collection;
};

// Create a new student
const createStudent = async (req, res) => {
  try {
    const newStudent = req.body;
    
    // Handle required fields with defaults if missing
    if (!newStudent.name) {
      newStudent.name = `Student-${Date.now()}`;
    }
    
    if (!newStudent.studentId) {
      newStudent.studentId = `ID-${Date.now()}`;
    }
    
    if (!newStudent.email) {
      newStudent.email = `student-${Date.now()}@example.com`;
    }
    
    // Check if student with same ID exists
    // Only check by ID, not email to allow for temporary placeholder emails
    const existingStudent = await studentsCollection.findOne({
      studentId: newStudent.studentId
    });
    
    if (existingStudent) {
      // Instead of rejecting, we'll update the existing student
      const result = await studentsCollection.updateOne(
        { studentId: newStudent.studentId },
        { $set: newStudent }
      );
      
      return res.status(200).json({
        success: true,
        message: 'Student updated successfully',
        data: newStudent
      });
    }
    
    // Convert string date to Date object if provided
    if (newStudent.enrollmentDate) {
      newStudent.enrollmentDate = new Date(newStudent.enrollmentDate);
    }
    
    if (newStudent.dateOfBirth) {
      newStudent.dateOfBirth = new Date(newStudent.dateOfBirth);
    }

    const result = await studentsCollection.insertOne(newStudent);
    
    res.status(201).json({
      success: true,
      data: { ...newStudent, _id: result.insertedId },
      message: 'Student created successfully'
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create student',
      error: error.message
    });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const { department, status, search } = req.query;
    let query = {};
    
    // Filter by department if provided
    if (department) {
      query.department = department;
    }
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Search by name or student ID if search term provided
    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { studentId: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const students = await studentsCollection.find(query).toArray();
    
    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
};

// Get a single student by ID
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    let student;
    // Check if id is a valid ObjectId
    if (ObjectId.isValid(id)) {
      student = await studentsCollection.findOne({ _id: new ObjectId(id) });
    }
    
    // If not found by ObjectId, try to find by studentId
    if (!student) {
      student = await studentsCollection.findOne({ studentId: id });
    }
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student',
      error: error.message
    });
  }
};

// Update a student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Process date fields if they exist
    if (updates.enrollmentDate) {
      updates.enrollmentDate = new Date(updates.enrollmentDate);
    }
    
    if (updates.dateOfBirth) {
      updates.dateOfBirth = new Date(updates.dateOfBirth);
    }
    
    let filter;
    // Check if id is a valid ObjectId
    if (ObjectId.isValid(id)) {
      filter = { _id: new ObjectId(id) };
    } else {
      filter = { studentId: id };
    }
    
    // Check if student exists
    const student = await studentsCollection.findOne(filter);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // Perform the update
    const result = await studentsCollection.updateOne(
      filter,
      { $set: updates }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // Get the updated student
    const updatedStudent = await studentsCollection.findOne(filter);
    
    res.status(200).json({
      success: true,
      data: updatedStudent,
      message: 'Student updated successfully'
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update student',
      error: error.message
    });
  }
};

// Delete a student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    let filter;
    // Check if id is a valid ObjectId
    if (ObjectId.isValid(id)) {
      filter = { _id: new ObjectId(id) };
    } else {
      filter = { studentId: id };
    }
    
    // Check if student exists
    const student = await studentsCollection.findOne(filter);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    const result = await studentsCollection.deleteOne(filter);
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete student',
      error: error.message
    });
  }
};

module.exports = {
  initController,
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
}; 