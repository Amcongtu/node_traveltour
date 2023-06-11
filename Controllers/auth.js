
import jwt from 'jsonwebtoken';
// import { createError } from './../utils/error.js';
import bcrypt from "bcryptjs"
import Employee from '../models/Employee.js';

import Customer from '../models/Customer.js'


//đăng nhập sử dụng passportjs
export const signUp = async (req, res) => {
  const { name, email, username, password } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await Employee.findOne({ username });

    // Check if user already exists
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new Customer({
      name,
      email,
      username,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save({ session });

    // Authenticate the user using passport
    req.login(newUser, (err) => {
      if (err) {
        console.error(err);

        // If there's an error, delete the newly created user
        Customer.findByIdAndDelete(newUser._id, (deleteErr) => {
          if (deleteErr) {
            console.error(deleteErr);
          }
        });

        session.abortTransaction();
        session.endSession();

        return res.status(500).json({ message: "Internal server error" });
      }

      session.commitTransaction();
      session.endSession();

      return res.json({ message: "User registered successfully" });
    });
  } catch (error) {

    session.abortTransaction();
    session.endSession();

    return res.status(500).json({ message: "Internal server error" });
  }
};






export const login = async (req,res,next)=>{
  try{
      // console.log(req.body)

      const user = await Employee.findOne({username:req.body.username, position: "admin"});
      // const user = await Employee.findOne({_id:req.user.id, position: req.user.position});
      if(!user) return res.status(404).json({message:"User not found!"});
      const isPasswordCorrect = await bcrypt.compare(req.body.password,user.password);
      if(!isPasswordCorrect) return res.status(400).json({message:"Wrong password or username!"});
      const token = jwt.sign(
          { id:user._id, position:user.position},
          process.env.JWT,
          { expiresIn: '6h' }
      );
      const {password,position,...otherDetails} = user._doc;  
      res.cookie("access_token", token, {
          httpOnly:true,
      })
      .status(200)
      .json({...otherDetails,"access_token":token})
      // .redirect('/');
  }catch(err){
      next(err)
  }
}



export const getAllEmployee = async(req,res,next)=>{
  try {
    const employee = await Employee.find({});
    return res.status(200).json({
      message:"Successfully",
      data:employee
    })
  } catch (err) {
    next(err)
  }
}
export const register = async (req,res,next)=>{
  // console.log(req.body.username)
  try{
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password,salt);
      
      const newUser = new Employee({
          name: req.body.name,
          username: req.body.username,
          email: req.body.email.toLowerCase(),  
          password: hash,
          position:req.body.position,
      })
      await newUser.save();
      return res.status(200).send("User has been created",)
  }catch(err){
      next(err)
  }
}
export const login_client = async (req,res,next)=>{
  try{
    const email = req.body.email.toLowerCase();
      const user = await Customer.findOne({email:email});
      // const user = await Employee.findOne({_id:req.user.id, position: req.user.position});
      // console.log(user)
      if(!user) return res.status(404).json({message:"User not found!"});
      const isPasswordCorrect = await bcrypt.compare(req.body.password,user.password);
      if(!isPasswordCorrect) return res.status(400).json({success: false,message:"Wrong password or username!"});
      const token = jwt.sign(
          { id:user._id},
          process.env.JWT,
          { expiresIn: '1h' }
      );
      const {password,...otherDetails} = user._doc;  
      return res.cookie("access_token_client", token, {
          httpOnly:true,
      })
      .status(200)
      .json({...otherDetails,"access_token_client":token,success: true,message: 'Login success!'})
      // .redirect('/');
  }catch(err){
      next(err)
  }
}


export const register_client = async (req,res,next)=>{
  try{
      const existUser = await Customer.findOne({email:req.body.email})
      if(existUser){
        return res.status(400).send({register: false, message: '"Email already exists"'})
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password,salt);

      const newUser = new Customer({
          name: req.body.name,
          email: req.body.email,  
          password: hash,
          phone:req.body.phone,
      })

      await newUser.save();
      return res.status(200).send({register: true, message: "User has been created"})
  }catch(err){
      next(err)
  }
}



