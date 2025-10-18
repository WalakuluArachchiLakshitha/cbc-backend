import express from "express";
import mongoose from "mongoose";
import orderRouter from "./routes/orderRouter.js";
// import studentRouter from "./routes/studentsRouter.js";
import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken";
import productRouter from "./routes/productRouter.js";
import cors from "cors"
import dotenv from "dotenv"


dotenv.config() //to use .env file data load to project

const app = express()

app.use(cors()) // to allow cross origin requests
app.use(express.json()) //middleware to arrange json data orderly

// ...existing code...
app.use(
    (req,res,next)=>{
       let token = req.header("Authorization")
       if(token!= null){
          token = token.replace("Bearer ","")
          
          jwt.verify(token,process.env.JWT_SECRET, 
            (err, decoded) => {
                if(err || decoded==null){
                    console.log("Invalid token login again");
                    // Use lowercase 'message' for consistency
                    return res.json({
                        message : "Invalid token login again"
                    })
                }else{
                  req.user = decoded  // add decoded data to req object
                  next() // Call next() only after a valid token is decoded
                }  
            }
          )
        } else {
            next() // Call next() if no token is present
        }
    }
)
// ...existing code...





const connectionString = process.env.MONGO_URI


mongoose.connect(connectionString).then(
    ()=>{
        console.log("Database connected successfully")
    }
).catch(
    ()=>{
        console.log("Database connection failed")
    }
)



// app.use("/students",studentRouter)
app.use("/api/users",userRouter)
app.use("/api/products", productRouter)
app.use("/api/orders", orderRouter)

app.listen(8000, 
    ()=>{
        console.log("Server is running on port 8000",)
        
    }
)