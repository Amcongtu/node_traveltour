import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique:true },
  password: { type: String, required: true },
  position: { 
    type: String,  
    enum: ['staff', 'admin', 'viewer'],
    default: 'staff',
  },
  date_of_birth: { type: Date, default:Date.now() },
  address: { type: String, default:"Empty address.." },
  email: { type: String, required: true },
},{timestamps:true});

const Employee =  mongoose.model('Employee', employeeSchema);

export default Employee;