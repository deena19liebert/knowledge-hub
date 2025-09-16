const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  summary: {
    type: String
  },
  embeddings: [{
    type: Number
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create text index for search
documentSchema.index({ 
  title: 'text', 
  content: 'text', 
  tags: 'text' 
});

module.exports = mongoose.model('Document', documentSchema);
