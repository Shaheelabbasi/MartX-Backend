import express from "express"
import { Login ,SignUp,logout,ForgetPassword,VerifyOtp} from "../Controllers/auth.controller.js";
const authRouter=express.Router();


authRouter.post("/login",Login)
authRouter.post("/signup",SignUp)
authRouter.post("/logout",logout)
authRouter.post("/forgotpassword",ForgetPassword)
authRouter.post("/verify-otp",VerifyOtp)


export{authRouter}