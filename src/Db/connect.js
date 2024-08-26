
import mongoose from "mongoose";


const connectDb=async()=>{

    try {
       const connectionInstance=await mongoose.connect(process.env.MONGO_URL)
        console.log("successfully connected to the database")
    } catch (error) {
        console.log("Error connecting to the database",error)
    }
}

export {
    connectDb
}