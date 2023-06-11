import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name: {
      type: String,
      default:"No name",
    },
    avatar: {
        type: String,
        default:"https://thptkesat.edu.vn/wp-content/uploads/2023/01/45-Avatar-Trang-Xoa-Cute-Dep-Cho-FB-Nam-Nu.png"
      },
    email: {
      type: String,
      required: true,
      unique:true,
    },
   
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default:"0000000000"
    },
    address: {
      type: String,
      default: "No address"
    },
    dateOfBirth: {
      type: Date,
      default: new Date('1970-01-01'),
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default:"male"
    },
    tours: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
    }],
    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    }],
  });
  
  export default mongoose.model.Customer ||  mongoose.model('Customer', customerSchema);