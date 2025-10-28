import RecurringExpense from '../models/RecurringExpense.js';

// @desc    Get all recurring expenses for user
// @route   GET /api/recurring
// @access  Private
export const getRecurringExpenses = async (req, res) => {
  try {
    const expenses = await RecurringExpense.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    console.error('Get Recurring Expenses Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching recurring expenses'
    });
  }
};

// @desc    Create new recurring expense
// @route   POST /api/recurring
// @access  Private
export const createRecurringExpense = async (req, res) => {
  try {
    const { name, amount, category, frequency, startDate, endDate, dayOfMonth, dayOfWeek, notes } = req.body;

    // Validation
    if (!name || !amount || !category || !frequency) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, amount, category, and frequency'
      });
    }

    const expense = await RecurringExpense.create({
      user: req.user.id,
      name,
      amount,
      category,
      frequency,
      startDate: startDate || Date.now(),
      endDate,
      dayOfMonth,
      dayOfWeek,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Recurring expense created successfully',
      data: expense
    });
  } catch (error) {
    console.error('Create Recurring Expense Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating recurring expense'
    });
  }
};

// @desc    Update recurring expense
// @route   PUT /api/recurring/:id
// @access  Private
export const updateRecurringExpense = async (req, res) => {
  try {
    let expense = await RecurringExpense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Recurring expense not found'
      });
    }

    // Check ownership
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this expense'
      });
    }

    expense = await RecurringExpense.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Recurring expense updated successfully',
      data: expense
    });
  } catch (error) {
    console.error('Update Recurring Expense Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating recurring expense'
    });
  }
};

// @desc    Delete recurring expense
// @route   DELETE /api/recurring/:id
// @access  Private
export const deleteRecurringExpense = async (req, res) => {
  try {
    const expense = await RecurringExpense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Recurring expense not found'
      });
    }

    // Check ownership
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this expense'
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Recurring expense deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete Recurring Expense Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting recurring expense'
    });
  }
};
