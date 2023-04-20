
import jwt from 'jsonwebtoken';
import { createError } from './../utils/error.js';
// import bcrypt from "bcryptjs"
import Employee from '../models/Employee.js';


export const isLogin = async(req,res,next)=>{
    try {
        const JWT_process = process.env.JWT

        const token = req.cookies.access_token;
        if(!token){
            return next(createError(401,"You are not authenticated!"));
        }
        jwt.verify(token,JWT_process,(err,user)=>{
            if(err){
                return next(createError(403,"Token is not valid!"));
            }
            req.user = user;
        })
        const user = await Employee.findOne({_id:req.user.id, position: req.user.position});
        const {password,position,...otherDetails} = user._doc;  
        // console.log(req.user)
        return res.status(200).json({
            success:true,
            data:otherDetails,
        })

    } catch (err) {
     next(err)   
    }
}