const { ObjectId } = require('mongodb');

let departmentsCollection;

// Initialize the controller with the database collection
const initController = (collection) => {
  departmentsCollection = collection;
};

// Get all departments
const getAllDepartments = async (req, res) => {
  try {
    const { code, status, search } = req.query;
    let query = {};
    
    // Filter by department code if provided
    if (code) {
      query.code = code;
    }
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Search by name or code if search term provided
    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const departments = await departmentsCollection.find(query).toArray();
    
    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch departments',
      error: error.message
    });
  }
};

// Get a single department by ID
const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid department ID format'
      });
    }
    
    const department = await departmentsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: department
    });
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch department',
      error: error.message
    });
  }
};

// Create a new department
const createDepartment = async (req, res) => {
  try {
    const newDepartment = req.body;

    // Validate required fields
    if (!newDepartment.name || !newDepartment.code) {
      return res.status(400).json({
        success: false,
        message: 'Department name and code are required'
      });
    }
    
    // Check if department code already exists
    const existingDepartment = await departmentsCollection.findOne({ code: newDepartment.code });
    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        message: `Department with code ${newDepartment.code} already exists`
      });
    }

    // Add timestamps
    newDepartment.createdAt = new Date();
    newDepartment.updatedAt = new Date();
    
    // Convert established date string to Date object if provided
    if (newDepartment.established) {
      newDepartment.establishedDate = new Date(newDepartment.established);
    }
    
    // Default status to active if not provided
    if (!newDepartment.status) {
      newDepartment.status = 'active';
    }
    
    // Insert the department into the database
    const result = await departmentsCollection.insertOne(newDepartment);
    
    res.status(201).json({
      success: true,
      data: { ...newDepartment, _id: result.insertedId },
      message: 'Department created successfully'
    });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create department',
      error: error.message
    });
  }
};

// Update a department
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid department ID format'
      });
    }
    
    // Set updated timestamp
    updates.updatedAt = new Date();
    
    // Convert established date string to Date object if provided
    if (updates.established) {
      updates.establishedDate = new Date(updates.established);
    }
    
    // Check if department exists
    const department = await departmentsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    
    // If code is being updated, check if the new code already exists
    if (updates.code && updates.code !== department.code) {
      const existingDepartment = await departmentsCollection.findOne({ code: updates.code });
      if (existingDepartment) {
        return res.status(400).json({
          success: false,
          message: `Department with code ${updates.code} already exists`
        });
      }
    }
    
    // Perform the update
    const result = await departmentsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    
    // Get the updated department
    const updatedDepartment = await departmentsCollection.findOne({ _id: new ObjectId(id) });
    
    res.status(200).json({
      success: true,
      data: updatedDepartment,
      message: 'Department updated successfully'
    });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update department',
      error: error.message
    });
  }
};

// Delete a department
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid department ID format'
      });
    }
    
    // Check if department exists
    const department = await departmentsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    
    // Perform the delete
    const result = await departmentsCollection.deleteOne({ _id: new ObjectId(id) });
    
    res.status(200).json({
      success: true,
      message: 'Department deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete department',
      error: error.message
    });
  }
};

// Add faculty to department
const addFacultyToDepartment = async (req, res) => {
  try {
    const { id, facultyId } = req.params;
    
    if (!ObjectId.isValid(id) || !ObjectId.isValid(facultyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
    
    // Update the department
    const result = await departmentsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $addToSet: { faculty: new ObjectId(facultyId) } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Faculty added to department successfully'
    });
  } catch (error) {
    console.error('Error adding faculty to department:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add faculty to department',
      error: error.message
    });
  }
};

module.exports = {
  initController,
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  addFacultyToDepartment
}; 