const { MongoClient, ObjectId } = require('mongodb');

/**
 * Initializes the announcement collection
 * @param {Object} db - MongoDB database instance
 * @returns {Object} Announcement collection instance
 */
async function initAnnouncementCollection(db) {
  if (!db) {
    throw new Error('Database instance is required');
  }

  try {
    const announcementCollection = db.collection('announcements');
    
    // Create basic indexes for efficient querying
    await announcementCollection.createIndex({ type: 1 });
    await announcementCollection.createIndex({ audience: 1 });
    await announcementCollection.createIndex({ department: 1 });
    // removed text index which is incompatible with apiStrict mode
    await announcementCollection.createIndex({ publishDate: 1 });
    await announcementCollection.createIndex({ expiryDate: 1 });
    await announcementCollection.createIndex({ featured: 1 });
    await announcementCollection.createIndex({ urgent: 1 });
    
    console.log('Announcement collection initialized');
    return announcementCollection;
  } catch (error) {
    console.error('Error initializing announcement collection:', error);
    throw error;
  }
}

module.exports = {
  initAnnouncementCollection
}; 