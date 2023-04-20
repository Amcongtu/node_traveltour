import mongoose from 'mongoose';

const { Schema } = mongoose;

const reviewSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  tour: {
    type: Schema.Types.ObjectId,
    ref: 'Tour',
    required: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
});

const Review = mongoose.model('Review', reviewSchema);

export default Review ;