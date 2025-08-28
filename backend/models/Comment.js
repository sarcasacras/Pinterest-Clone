import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    minlength: [1, 'Comment cannot be empty'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    validate: {
      validator: function(v) {
        return v.trim().length > 0;
      },
      message: 'Comment cannot be empty or just whitespace'
    }
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Comment author is required']
  },
  pin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pin',
    required: [true, 'Pin reference is required']
  }
}, {
  timestamps: true
});

export default mongoose.model('Comment', commentSchema);