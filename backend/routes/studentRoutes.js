const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// GET all students
router.get('/', studentController.getAllStudents);

// GET a single student
router.get('/:id', studentController.getStudentById);

// POST create a new student
router.post('/', studentController.createStudent);

// PUT update a student
router.put('/:id', studentController.updateStudent);

// DELETE a student
router.delete('/:id', studentController.deleteStudent);

module.exports = router; 