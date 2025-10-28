import EMI from '../models/EMI.js';

// @desc    Get all EMIs for user
// @route   GET /api/emi
// @access  Private
export const getEMIs = async (req, res) => {
  try {
    const emis = await EMI.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: emis.length,
      data: emis
    });
  } catch (error) {
    console.error('Get EMIs Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching EMIs'
    });
  }
};

// @desc    Create new EMI
// @route   POST /api/emi
// @access  Private
export const createEMI = async (req, res) => {
  try {
    const { name, totalAmount, monthlyEMI, remainingAmount, interestRate, startDate, endDate, dueDate, notes } = req.body;

    // Validation
    if (!name || !totalAmount || !monthlyEMI || remainingAmount === undefined || !endDate || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const emi = await EMI.create({
      user: req.user.id,
      name,
      totalAmount,
      monthlyEMI,
      remainingAmount,
      interestRate,
      startDate: startDate || Date.now(),
      endDate,
      dueDate,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'EMI created successfully',
      data: emi
    });
  } catch (error) {
    console.error('Create EMI Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating EMI'
    });
  }
};

// @desc    Update EMI
// @route   PUT /api/emi/:id
// @access  Private
export const updateEMI = async (req, res) => {
  try {
    let emi = await EMI.findById(req.params.id);

    if (!emi) {
      return res.status(404).json({
        success: false,
        message: 'EMI not found'
      });
    }

    // Check ownership
    if (emi.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this EMI'
      });
    }

    emi = await EMI.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'EMI updated successfully',
      data: emi
    });
  } catch (error) {
    console.error('Update EMI Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating EMI'
    });
  }
};

// @desc    Delete EMI
// @route   DELETE /api/emi/:id
// @access  Private
export const deleteEMI = async (req, res) => {
  try {
    const emi = await EMI.findById(req.params.id);

    if (!emi) {
      return res.status(404).json({
        success: false,
        message: 'EMI not found'
      });
    }

    // Check ownership
    if (emi.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this EMI'
      });
    }

    await emi.deleteOne();

    res.status(200).json({
      success: true,
      message: 'EMI deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete EMI Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting EMI'
    });
  }
};
