import mongoose from 'mongoose';

const { Schema } = mongoose;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100,
  },
  // author: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Employee',
  //   required: true,
  // },
  author:{
    type:String,
    default:"Admin",
  },
  content: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  public_id:[{
    type:String,
  }],
  image: {
    type: String,
  },
  image_public_id: {
    type: String,
  },
  tags: [{
    type: String,
    trim: true,
    maxLength: 50,
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
},{timestamps:true});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;