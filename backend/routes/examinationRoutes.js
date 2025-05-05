const express = require('express');
const router = express.Router();
const examinationController = require('../controllers/examinationController');

// GET all examinations
router.get('/', examinationController.getAllExaminations);

// GET a single examination
router.get('/:id', examinationController.getExaminationById);

// POST create a new examination
router.post('/', examinationController.createExamination);

// PUT update an examination
router.put('/:id', examinationController.updateExamination);

// DELETE an examination
router.delete('/:id', examinationController.deleteExamination);

// GET examinations for a specific course
router.get('/course/:courseId', examinationController.getExaminationsByCourse);

module.exports = router; 