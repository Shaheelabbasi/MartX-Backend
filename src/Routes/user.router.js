import express from 'express'

const userRouter=express.Router()
import { addTocart,HandlePayment} from '../Controllers/user.controller.js'
import VerifyJwt from '../Middlewares/auth.middleware.js'


userRouter.post("/addtocart",VerifyJwt,addTocart)
userRouter.post("/payment",VerifyJwt,HandlePayment)


export{userRouter}