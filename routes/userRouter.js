import express from 'express';
import { createUser,updatePassword,updateUserData, getUser, getUsers, getStats, getAllUsers, blockUser, deleteUser, googleLogin, loginUser, sendOTP, changePasswordViaOTP } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get("/", getUsers)
userRouter.get("/stats", getStats)
userRouter.get("/all-users", getAllUsers)
userRouter.put("/block/:email", blockUser)
userRouter.delete("/:email", deleteUser)
userRouter.post("/", createUser)
userRouter.post("/login", loginUser)
userRouter.get("/me", getUser)
userRouter.post("/google-login", googleLogin)
userRouter.get("/send-otp/:email", sendOTP)
userRouter.post("/change-password", changePasswordViaOTP)
userRouter.put("/me",updateUserData)
userRouter.put("/me/password",updatePassword)
export default userRouter;