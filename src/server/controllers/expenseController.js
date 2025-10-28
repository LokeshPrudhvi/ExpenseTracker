import Expense from '../models/Expense.js';

// @desc    Get all expenses for user
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    console.error('Get Expenses Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching expenses'
    });
  }
};

// @desc    Get expenses by date range
// @route   GET /api/expenses/range?startDate=&endDate=
// @access  Private
export const getExpensesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide startDate and endDate'
      });
    }

    const expenses = await Expense.find({
      user: req.user.id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    console.error('Get Expenses By Date Range Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching expenses'
    });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (req, res) => {
  try {
    const { description, amount, category, date, paymentMethod, notes } = req.body;

    // Validation
    if (!description || !amount || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide description, amount, and category'
      });
    }

    const expense = await Expense.create({
      user: req.user.id,
      description,
      amount,
      category,
      date: date || Date.now(),
      paymentMethod,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense
    });
  } catch (error) {
    console.error('Create Expense Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating expense'
    });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Check ownership
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this expense'
      });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: expense
    });
  } catch (error) {
    console.error('Update Expense Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating expense'
    });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
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
      message: 'Expense deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete Expense Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting expense'
    });
  }
};
