import mongoose from 'mongoose';
import reviewSchema from './Review.js';
import sanitizeHtml from 'sanitize-html';
const { Schema } = mongoose;

const tourSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    // required: true,
    default:"Tour is not description."
  },
  price: {
    type: Number,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  image_public_id: {
    type: String,
    required: true,
  },
  images: [{
    type: String,

  }],
  level: {
    type: String,
    required: true,
  },
  availableSlots: {
    type: Number,
    default: 0,
  },
  age: {
    type: Number,
    default: 3,
  },
  numberOfDay:{
    type: Number,
    required: true,
  },
  // reviews: [reviewSchema],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  
  public_id:{
    type: [String],

  },
  rating: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  content: {
    type: String,
    required: true,
    // set: (value) => sanitizeHtml(value),
  },
},{timestamps:true});



const Tour = mongoose.model.Tour || mongoose.model('Tour', tourSchema);

export default Tour ;

