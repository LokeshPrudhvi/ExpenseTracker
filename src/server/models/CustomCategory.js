import mongoose from 'mongoose';

const customCategorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    trim: true
  },
  icon: {
    type: String,
    default: '📁'
  },
  color: {
    type: String,
    default: '#6B7280'
  }
}, {
  timestamps: true
});

// Index for faster queries
customCategorySchema.index({ user: 1 });

// Prevent duplicate category names for the same user
customCategorySchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model('CustomCategory', customCategorySchema);
