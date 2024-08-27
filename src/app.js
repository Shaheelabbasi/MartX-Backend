
import  express from 'express'
import Cookieparser from 'cookie-parser'
import { authRouter } from './Routes/auth.router.js';
const app=express();
app.use(express.json())
app.use(Cookieparser())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
import { adminRouter } from './Routes/admin.router.js';


//Routers


app.use("/MartX/auth",authRouter)
app.use("/MartX/admin",adminRouter)


export default app;