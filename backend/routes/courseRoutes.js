const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// GET all courses
router.get('/', courseController.getAllCourses);

// GET a single course
router.get('/:id', courseController.getCourseById);

// POST create a new course
router.post('/', courseController.createCourse);

// PUT update a course
router.put('/:id', courseController.updateCourse);

// DELETE a course
router.delete('/:id', courseController.deleteCourse);

// POST enroll a student in a course
router.post('/:courseId/enroll/:studentId', courseController.enrollStudent);

// DELETE remove a student from a course
router.delete('/:courseId/enroll/:studentId', courseController.removeStudent);

module.exports = router; 