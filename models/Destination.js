import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default:"Destination is not description."
  },
  image: {
    type: String,
    default:"https://tse2.mm.bing.net/th?id=OIP.49JzF-LUDDBCKfQX_aqkdwHaHa&pid=Api&P=0"
  },
  public_key_image: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  tours: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
    },
  ],
},{timestamps:true});

export default mongoose.model('Destination', destinationSchema);