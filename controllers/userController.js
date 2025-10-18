import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export function createUser(req,res){

    console.log("Post request received")
    const hashedPassword = bcrypt.hashSync(req.body.password,10)

    const user = new User(
        {
            email : req.body.email,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            password : hashedPassword
        }
    )

    user.save().then(
        ()=>{
            res.json({
                message: "User created successfully"
            })
        }
    ).catch(
        ()=>{
            res.json({
                message: "Failed to create user"
            })
        }
    )
}

export function loginUser(req,res){

    console.log("Login request received")
    User.findOne(
        {
            email : req.body.email
        }
    ).then(
        (user)=>{
            if(user == null){
                res.status(404).json(
                    {
                        message: "User not found"
                    }
                )
            }else{
                const isPasswordMatching = bcrypt.compareSync(req.body.password, user.password)
                if(isPasswordMatching){
                    const token = jwt.sign( //use jwt.sign to create token from user data

                           {
                            email : user.email,
                            firstName : user.firstName,
                            lastName : user.lastName,
                            role : user.role,
                            isemailVerified : user.isEmailVerified,

                           },
                        process.env.JWT_SECRET,
                          { expiresIn: "1h" }
                           



                        )
                    res.json(
                        {
                            message: "Login successful",
                            token: token,
                            user:{
                                 email : user.email,
                                 firstName : user.firstName,
                                 lastName : user.lastName,
                                 role : user.role,
                                 isemailVerified : user.isEmailVerified,
                            }
                        }
                    )
                }else{
                    res.status(401).json(
                        {
                            message: "Invalid password"
                        }
                    )
                }
            }
        }
    )
}
export function isAdmin(req){
    if(req.user == null){
        return false
    }
    if(req.user.role != "admin"){
        return false
    }
    return true;
}

export function isUser(req){
    if(req.user == null){
        return false
    }
    if(req.user.role != "user"){
        return false
    }
}