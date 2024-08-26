import express from "express"
import { Login ,SignUp,logout} from "../Controllers/auth.controller.js";
const authRouter=express.Router();


authRouter.post("/login",Login)
authRouter.post("/signup",SignUp)
authRouter.post("/logout",logout)



export{authRouter}