import mongoose from 'mongoose';


const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      subject: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['noprocess', 'process'],
        default: 'noprocess',
      },
},{timestamps:true})

export default mongoose.model.Contact || mongoose.model('Contact', contactSchema);