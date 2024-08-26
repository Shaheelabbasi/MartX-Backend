
import  express from 'express'
import Cookieparser from 'cookie-parser'
import { authRouter } from './Routes/auth.router.js';
const app=express();
app.use(express.json())
app.use(Cookieparser())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))



//Routers


app.use("/MartX/auth",authRouter)


export default app;