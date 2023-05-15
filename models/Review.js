import mongoose from 'mongoose';

const { Schema } = mongoose;

const reviewSchema = new Schema({
  
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
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
}, {timestamps:true});

const Review = mongoose.model('Review', reviewSchema);

export default Review ;