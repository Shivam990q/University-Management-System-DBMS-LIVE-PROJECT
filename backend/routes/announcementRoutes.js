const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');

// GET all announcements
router.get('/', announcementController.getAllAnnouncements);

// GET a single announcement
router.get('/:id', announcementController.getAnnouncementById);

// POST create a new announcement
router.post('/', announcementController.createAnnouncement);

// PUT update an announcement
router.put('/:id', announcementController.updateAnnouncement);

// DELETE an announcement
router.delete('/:id', announcementController.deleteAnnouncement);

module.exports = router; 