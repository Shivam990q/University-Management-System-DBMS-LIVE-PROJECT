const { ObjectId } = require('mongodb');

let examinationsCollection;

// Initialize the controller with the database collection
const initController = (collection) => {
  examinationsCollection = collection;
};

// Create a new examination
const createExamination = async (req, res) => {
  try {
    const newExamination = req.body;
    
    // Convert string date to Date objects
    if (newExamination.startDate) {
      newExamination.startDate = new Date(newExamination.startDate);
    }
    
    if (newExamination.endDate) {
      newExamination.endDate = new Date(newExamination.endDate);
    }
    
    if (newExamination.createdAt) {
      newExamination.createdAt = new Date(newExamination.createdAt);
    } else {
      newExamination.createdAt = new Date();
    }
    
    // Convert numeric strings to integers
    if (newExamination.duration) {
      newExamination.duration = parseInt(newExamination.duration);
    }
    
    if (newExamination.maxMarks) {
      newExamination.maxMarks = parseInt(newExamination.maxMarks);
    }
    
    if (newExamination.passingMarks) {
      newExamination.passingMarks = parseInt(newExamination.passingMarks);
    }
    
    // Insert the examination into the database
    const result = await examinationsCollection.insertOne(newExamination);
    
    res.status(201).json({
      success: true,
      data: { ...newExamination, _id: result.insertedId },
      message: 'Examination created successfully'
    });
  } catch (error) {
    console.error('Error creating examination:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create examination',
      error: error.message
    });
  }
};

// Get all examinations with filtering options
const getAllExaminations = async (req, res) => {
  try {
    const { department, type, status, academicTerm, search } = req.query;
    let query = {};
    
    // Filter by department if provided
    if (department) {
      query.department = department;
    }
    
    // Filter by examination type if provided
    if (type) {
      query.type = type;
    }
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Filter by academic term if provided
    if (academicTerm) {
      query.academicTerm = academicTerm;
    }
    
    // Search by title or other relevant fields if search term provided
    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { venue: { $regex: search, $options: 'i' } },
          { instructions: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const examinations = await examinationsCollection.find(query).sort({ startDate: 1 }).toArray();
    
    res.status(200).json({
      success: true,
      count: examinations.length,
      data: examinations
    });
  } catch (error) {
    console.error('Error fetching examinations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch examinations',
      error: error.message
    });
  }
};

// Get a single examination by ID
const getExaminationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid examination ID format'
      });
    }
    
    const examination = await examinationsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!examination) {
      return res.status(404).json({
        success: false,
        message: 'Examination not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: examination
    });
  } catch (error) {
    console.error('Error fetching examination:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch examination',
      error: error.message
    });
  }
};

// Update an examination
const updateExamination = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid examination ID format'
      });
    }
    
    // Process date fields if present
    if (updates.startDate) {
      updates.startDate = new Date(updates.startDate);
    }
    
    if (updates.endDate) {
      updates.endDate = new Date(updates.endDate);
    }
    
    // Process numeric fields if present
    if (updates.duration) {
      updates.duration = parseInt(updates.duration);
    }
    
    if (updates.maxMarks) {
      updates.maxMarks = parseInt(updates.maxMarks);
    }
    
    if (updates.passingMarks) {
      updates.passingMarks = parseInt(updates.passingMarks);
    }
    
    // Check if examination exists
    const examination = await examinationsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!examination) {
      return res.status(404).json({
        success: false,
        message: 'Examination not found'
      });
    }
    
    // Perform the update
    const result = await examinationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Examination not found'
      });
    }
    
    // Get the updated examination
    const updatedExamination = await examinationsCollection.findOne({ _id: new ObjectId(id) });
    
    res.status(200).json({
      success: true,
      data: updatedExamination,
      message: 'Examination updated successfully'
    });
  } catch (error) {
    console.error('Error updating examination:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update examination',
      error: error.message
    });
  }
};

// Delete an examination
const deleteExamination = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid examination ID format'
      });
    }
    
    // Check if examination exists
    const examination = await examinationsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!examination) {
      return res.status(404).json({
        success: false,
        message: 'Examination not found'
      });
    }
    
    const result = await examinationsCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Examination not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Examination deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting examination:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete examination',
      error: error.message
    });
  }
};

// Get examinations for a specific course
const getExaminationsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const examinations = await examinationsCollection.find({
      courses: courseId
    }).sort({ startDate: 1 }).toArray();
    
    res.status(200).json({
      success: true,
      count: examinations.length,
      data: examinations
    });
  } catch (error) {
    console.error('Error fetching course examinations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course examinations',
      error: error.message
    });
  }
};

module.exports = {
  initController,
  createExamination,
  getAllExaminations,
  getExaminationById,
  updateExamination,
  deleteExamination,
  getExaminationsByCourse
}; 