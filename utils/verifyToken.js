import jwt from "jsonwebtoken"


export const verifyToken = (req,res,next)=>{
    const token = req.body.access_token;
    const JWT_process = process.env.JWT
    if(token){
        jwt.verify(token,JWT_process,(err,user)=>{
            // console.log(user)
            // console.log("chay")
    
            if(err){
                return res.status(403).json({message:"Token is not valid!"});
            }
            req.user = user;
    
            next()
        })
    }
    else{

        return res.status(401).json({message:"You are not authenticated!"});

    }

}
export const verifyAdmin = (req,res,next)=>{
    verifyToken(req,res ,()=>{

        if(req.user.position && req.user.position==="admin" ){
            next();
        }else{
            
            return res.status(403).json({message:"You are not authorized!"});
        }
    })
}


export const verifyTokenClient = (req,res,next)=>{
    const token = req.body.access_token_client;
    const JWT_process = process.env.JWT
    if(token){
        jwt.verify(token,JWT_process,(err,user)=>{
            // console.log(user)
            // console.log("chay")
    
            if(err){
                return res.status(403).json({message:"Token is not valid!"});
            }
            req.user = user;
    
            next()
        })
    }
    else{

        return res.status(401).json({message:"You are not authenticated!"});

    }

}
export const verifyClient = (req,res,next)=>{
    verifyTokenClient(req,res ,()=>{

        if(req.user){
            next();
        }else{
            
            return res.status(403).json({message:"You are not authorized!"});
        }
    })
}