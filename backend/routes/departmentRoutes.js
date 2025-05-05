const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

// GET all departments
router.get('/', departmentController.getAllDepartments);

// GET a single department by ID
router.get('/:id', departmentController.getDepartmentById);

// POST create a new department
router.post('/', departmentController.createDepartment);

// PUT update a department
router.put('/:id', departmentController.updateDepartment);

// DELETE a department
router.delete('/:id', departmentController.deleteDepartment);

// POST add faculty to department
router.post('/:id/faculty/:facultyId', departmentController.addFacultyToDepartment);

module.exports = router; 