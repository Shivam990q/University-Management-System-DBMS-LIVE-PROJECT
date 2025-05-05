const { ObjectId } = require('mongodb');

let coursesCollection;

// Initialize the controller with the database collection
const initController = (collection) => {
  coursesCollection = collection;
};

// Create a new course
const createCourse = async (req, res) => {
  try {
    const newCourse = req.body;
    
    // Check if course with same code exists
    const existingCourse = await coursesCollection.findOne({
      courseCode: newCourse.courseCode
    });
    
    if (existingCourse) {
      return res.status(400).json({ 
        success: false, 
        message: 'Course with this code already exists' 
      });
    }
    
    const result = await coursesCollection.insertOne(newCourse);
    
    res.status(201).json({
      success: true,
      data: { ...newCourse, _id: result.insertedId },
      message: 'Course created successfully'
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create course',
      error: error.message
    });
  }
};

// Get all courses
const getAllCourses = async (req, res) => {
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
    
    // Search by name or course code if search term provided
    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { courseCode: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const courses = await coursesCollection.find(query).toArray();
    
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: error.message
    });
  }
};

// Get a single course by ID or code
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    
    let course;
    // Check if id is a valid ObjectId
    if (ObjectId.isValid(id)) {
      course = await coursesCollection.findOne({ _id: new ObjectId(id) });
    }
    
    // If not found by ObjectId, try to find by courseCode
    if (!course) {
      course = await coursesCollection.findOne({ courseCode: id });
    }
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course',
      error: error.message
    });
  }
};

// Update a course
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    let filter;
    // Check if id is a valid ObjectId
    if (ObjectId.isValid(id)) {
      filter = { _id: new ObjectId(id) };
    } else {
      filter = { courseCode: id };
    }
    
    // Check if course exists
    const course = await coursesCollection.findOne(filter);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Perform the update
    const result = await coursesCollection.updateOne(
      filter,
      { $set: updates }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Get the updated course
    const updatedCourse = await coursesCollection.findOne(filter);
    
    res.status(200).json({
      success: true,
      data: updatedCourse,
      message: 'Course updated successfully'
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update course',
      error: error.message
    });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    let filter;
    // Check if id is a valid ObjectId
    if (ObjectId.isValid(id)) {
      filter = { _id: new ObjectId(id) };
    } else {
      filter = { courseCode: id };
    }
    
    // Check if course exists
    const course = await coursesCollection.findOne(filter);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    const result = await coursesCollection.deleteOne(filter);
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete course',
      error: error.message
    });
  }
};

// Enroll a student in a course
const enrollStudent = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    
    let courseFilter;
    // Check if courseId is a valid ObjectId
    if (ObjectId.isValid(courseId)) {
      courseFilter = { _id: new ObjectId(courseId) };
    } else {
      courseFilter = { courseCode: courseId };
    }
    
    // Find the course
    const course = await coursesCollection.findOne(courseFilter);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if student is already enrolled
    if (course.enrolledStudents && course.enrolledStudents.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Student is already enrolled in this course'
      });
    }
    
    // Check max capacity
    if (course.enrolledStudents && course.enrolledStudents.length >= course.maxCapacity) {
      return res.status(400).json({
        success: false,
        message: 'Course has reached maximum capacity'
      });
    }
    
    // Update the course with the student
    const result = await coursesCollection.updateOne(
      courseFilter,
      { $addToSet: { enrolledStudents: studentId } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Student enrolled successfully'
    });
  } catch (error) {
    console.error('Error enrolling student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll student',
      error: error.message
    });
  }
};

// Remove a student from a course
const removeStudent = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    
    let courseFilter;
    // Check if courseId is a valid ObjectId
    if (ObjectId.isValid(courseId)) {
      courseFilter = { _id: new ObjectId(courseId) };
    } else {
      courseFilter = { courseCode: courseId };
    }
    
    // Find the course
    const course = await coursesCollection.findOne(courseFilter);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if student is enrolled
    if (!course.enrolledStudents || !course.enrolledStudents.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Student is not enrolled in this course'
      });
    }
    
    // Update the course by removing the student
    const result = await coursesCollection.updateOne(
      courseFilter,
      { $pull: { enrolledStudents: studentId } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Student removed from course successfully'
    });
  } catch (error) {
    console.error('Error removing student from course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove student from course',
      error: error.message
    });
  }
};

module.exports = {
  initController,
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollStudent,
  removeStudent
}; 