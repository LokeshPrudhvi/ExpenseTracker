import SavingsGoal from '../models/SavingsGoal.js';

// @desc    Get all savings goals for user
// @route   GET /api/savings
// @access  Private
export const getSavingsGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals
    });
  } catch (error) {
    console.error('Get Savings Goals Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching savings goals'
    });
  }
};

// @desc    Create new savings goal
// @route   POST /api/savings
// @access  Private
export const createSavingsGoal = async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, deadline, description } = req.body;

    // Validation
    if (!name || !targetAmount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and target amount'
      });
    }

    const goal = await SavingsGoal.create({
      user: req.user.id,
      name,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Savings goal created successfully',
      data: goal
    });
  } catch (error) {
    console.error('Create Savings Goal Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating savings goal'
    });
  }
};

// @desc    Update savings goal
// @route   PUT /api/savings/:id
// @access  Private
export const updateSavingsGoal = async (req, res) => {
  try {
    let goal = await SavingsGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Savings goal not found'
      });
    }

    // Check ownership
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this goal'
      });
    }

    goal = await SavingsGoal.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Savings goal updated successfully',
      data: goal
    });
  } catch (error) {
    console.error('Update Savings Goal Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating savings goal'
    });
  }
};

// @desc    Delete savings goal
// @route   DELETE /api/savings/:id
// @access  Private
export const deleteSavingsGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Savings goal not found'
      });
    }

    // Check ownership
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this goal'
      });
    }

    await goal.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Savings goal deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete Savings Goal Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting savings goal'
    });
  }
};
