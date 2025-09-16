import express from "express";
import mongoose from "mongoose";
import studentRouter from "./routes/studentsRouter.js";
import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken";
import productRouter from "./routes/productRouter.js";

const app = express()

app.use(express.json()) //middleware to arrange json data orderly

app.use(
    (req,res,next)=>{
       let token = req.header("Authorization")
       if(token!= null){
          token = token.replace("Bearer ","")
          
          jwt.verify(token, "jwt-secret", 
            (err, decoded) => {
                    
                            
                        if(decoded==null){
                            console.log("Invalid token login again");
                            res.json({

                                Message : "Invalid token login again"
                            })
                        return         
 
                        }else{
                          req.user = decoded  // add decoded data to req object
                          }  
                        
            }
                            
                    )
                }
                next() // req + decoded data go to next
            }
         )

const connectionString = "mongodb+srv://admin:00000000@cluster0.gfndi9u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


mongoose.connect(connectionString).then(
    ()=>{
        console.log("Database connected successfully")
    }
).catch(
    ()=>{
        console.log("Database connection failed")
    }
)



app.use("/students",studentRouter)
app.use("/users",userRouter)
app.use("/products", productRouter)

app.listen(8000, 
    ()=>{
        console.log("Server is running on port 8000")
        
    }
)