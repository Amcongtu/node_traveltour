
import jwt from 'jsonwebtoken';
import { createError } from './../utils/error.js';
import bcrypt from "bcryptjs"
import Employee from '../models/Employee.js';


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
    console.error(error);

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
          { expiresIn: '1h' }
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

export const register = async (req,res,next)=>{
  // console.log(req.body.username)
  try{
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password,salt);
      
      const newUser = new Employee({
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,  
          password: hash,
          position:req.body.position,
      })
      await newUser.save();
      res.status(200).send("User has been created",)
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