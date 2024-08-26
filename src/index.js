import dotenv from 'dotenv'
dotenv.config({path:"./.env"})
import app from "./app.js";


import { connectDb } from "./Db/connect.js";


connectDb().then(()=>{

    app.listen(process.env.PORT,()=>console.log(`Server is running on the port ${process.env.PORT}`))
}).catch(err=>console.log(err))

