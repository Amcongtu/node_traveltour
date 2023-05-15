import  express  from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
// import bodyParser from 'body-parser';
import cors from 'cors'
import routerTour from './routes/routeTour.js';
import routerBlog from './routes/routeBlog.js';
import routerDestionation from './routes/routeDestination.js';
import routerEmployee from "./routes/routeEmployee.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import authRouter from './routes/routerAuth.js'
import contactRouter from './routes/routerContact.js'
import reviewRouter from './routes/routerReview.js'

dotenv.config()

//kết nối tới mongosedb
const connect = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO)
        console.log("Connected to MongoDB")
    }catch(error){
        throw error;
    }
}

mongoose.connection.on("disconnected",()=>{
    console.log("MongoDB disconnected");
})

mongoose.connection.on("connected",()=>{
    console.log("MongoDB connected");
})



const app = express();
app.use(cors());
app.use(cookieParser())
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));     

// nhúng middleware vào express
app.use(express.json())

//sau khi chạy route nếu lỗi thì bắn ra lỗi

app.use("/api/tour",routerTour),
app.use("/api/blog",routerBlog),
app.use("/api/destination",routerDestionation),
app.use("/api/employee",routerEmployee),
app.use('/api/auth',authRouter)
app.use('/api/review',reviewRouter)
app.use('/api/contact',contactRouter)

app.use((err, req, res, next)=>{
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Somthing went wrong!"
    return res.status(errorMessage).json({
        success: false, 
        status : errorStatus,
        message : errorMessage,
        stack: err.stack
    })
})



app.listen(8800,()=>{
    // res.json("thanh cong")
    console.log("Connect to backend!")
    connect()
})

