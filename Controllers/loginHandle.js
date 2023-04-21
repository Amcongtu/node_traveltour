
import jwt from 'jsonwebtoken';
// import { createError } from './../utils/error.js';
// import bcrypt from "bcryptjs"
import Employee from '../models/Employee.js';


export const isLogin = async(req,res,next)=>{
    try {
        const JWT_process = process.env.JWT

        const token = req.body.access_token;
        if(!token){
           
            return  res.status(401).json({
                message:"You are not authenticated!"
            })
        }
        jwt.verify(token,JWT_process,(err,user)=>{
            
            if(err){
                res.status(403).json({
                    message:"Token is not valid!"
                })
                return  res.status(403).json({
                    message:"Token is not valid!"
                });
            }
            req.user = user;
        })
        const user = await Employee.findOne({_id:req.user.id, position: req.user.position});
        if(!user) return res.status(404).json({message:"User not found!"});

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
export const logout = async(req,res,next)=>{
    try {
        const JWT_process = process.env.JWT

        const token = req.body.access_token;
        if(!token){
           
            return  res.status(401).json({
                message:"You are not authenticated!"
            })
        }
        jwt.verify(token,JWT_process,(err,user)=>{
            
            if(err){
                res.status(403).json({
                    message:"Token is not valid!"
                })
                return  res.status(403).json({
                    message:"Token is not valid!"
                });
            }
            req.user = user;
        })
        const user = await Employee.findOne({_id:req.user.id, position: req.user.position});
        if(!user) return res.status(404).json({message:"User not found!"});
        return  res.status(200).json({
            message:"Successfully."
        })
    } catch (error) {
        next(error)
    }
}