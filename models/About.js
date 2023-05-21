import mongoose from 'mongoose';

const { Schema } = mongoose;

const aboutSchema = new Schema({
  content: {
    type: String,
    default:"About Us"
  },
  id:{
    type:String,
    default:"IDAbout"
  }
 
},{timestamps:true});

const About = mongoose.model('About', aboutSchema);

export default About;