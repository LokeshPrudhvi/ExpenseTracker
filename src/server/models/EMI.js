import mongoose from 'mongoose';

const emiSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add EMI name (e.g., Car Loan)'],
    trim: true
  },
  totalAmount: {
    type: Number,
    required: [true, 'Please add total loan amount'],
    min: [0, 'Amount cannot be negative']
  },
  monthlyEMI: {
    type: Number,
    required: [true, 'Please add monthly EMI amount'],
    min: [0, 'EMI cannot be negative']
  },
  remainingAmount: {
    type: Number,
    required: true,
    min: [0, 'Remaining amount cannot be negative']
  },
  interestRate: {
    type: Number,
    min: [0, 'Interest rate cannot be negative'],
    max: [100, 'Interest rate cannot exceed 100%']
  },
  startDate: {
    type: Date,
    required: [true, 'Please add start date'],
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'Please add end date']
  },
  dueDate: {
    type: Number,
    required: [true, 'Please add due date (day of month)'],
    min: 1,
    max: 31
  },
  category: {
    type: String,
    default: 'EMI'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  payments: [{
    date: {
      type: Date,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    isPaid: {
      type: Boolean,
      default: false
    }
  }],
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
emiSchema.index({ user: 1, isActive: 1 });

export default mongoose.model('EMI', emiSchema);
