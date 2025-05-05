const { ObjectId } = require('mongodb');

let announcementCollection;

// Initialize the controller with the database collection
const initController = (collection) => {
  announcementCollection = collection;
};

// Get all announcements
const getAllAnnouncements = async (req, res) => {
  try {
    const { 
      type, 
      audience, 
      department, 
      featured, 
      urgent, 
      search,
      page = 1, 
      limit = 10 
    } = req.query;
    
    const filter = {};
    
    if (type) filter.type = type;
    if (audience) filter.audience = audience;
    if (department) filter.department = department;
    if (featured) filter.featured = featured === 'true';
    if (urgent) filter.urgent = urgent === 'true';
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [announcements, total] = await Promise.all([
      announcementCollection
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray(),
      announcementCollection.countDocuments(filter)
    ]);
    
    res.json({
      data: announcements,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error in getAllAnnouncements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single announcement by ID
const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid announcement ID' });
    }
    
    const announcement = await announcementCollection.findOne({ 
      _id: new ObjectId(id) 
    });
    
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    
    res.json(announcement);
  } catch (error) {
    console.error('Error in getAnnouncementById:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new announcement
const createAnnouncement = async (req, res) => {
  try {
    const { 
      title, 
      content, 
      type, 
      audience, 
      department, 
      publishDate, 
      expiryDate,
      featured = false, 
      urgent = false,
      attachments = [],
      sendEmail = false,
      sendPushNotification = false 
    } = req.body;
    
    // Validate required fields
    if (!title || !content || !type || !audience) {
      return res.status(400).json({ 
        error: 'Missing required fields (title, content, type, audience)' 
      });
    }
    
    const newAnnouncement = {
      title,
      content,
      type,
      audience,
      department,
      publishDate: publishDate ? new Date(publishDate) : new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      featured,
      urgent,
      attachments,
      sendEmail,
      sendPushNotification,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await announcementCollection.insertOne(newAnnouncement);
    
    if (!result.acknowledged) {
      return res.status(500).json({ error: 'Failed to create announcement' });
    }
    
    res.status(201).json({ 
      message: 'Announcement created successfully',
      id: result.insertedId,
      announcement: { _id: result.insertedId, ...newAnnouncement }
    });
  } catch (error) {
    console.error('Error in createAnnouncement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update an announcement
const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid announcement ID' });
    }
    
    const updateData = { ...req.body, updatedAt: new Date() };
    
    // Convert date strings to Date objects
    if (updateData.publishDate) {
      updateData.publishDate = new Date(updateData.publishDate);
    }
    
    if (updateData.expiryDate) {
      updateData.expiryDate = new Date(updateData.expiryDate);
    }
    
    // Remove _id if present
    delete updateData._id;
    
    const result = await announcementCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    
    if (result.modifiedCount === 0) {
      return res.status(200).json({ message: 'No changes made to announcement' });
    }
    
    res.json({ 
      message: 'Announcement updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error in updateAnnouncement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete an announcement
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid announcement ID' });
    }
    
    const result = await announcementCollection.deleteOne({ 
      _id: new ObjectId(id) 
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    
    res.json({ 
      message: 'Announcement deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error in deleteAnnouncement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  initController,
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
}; 