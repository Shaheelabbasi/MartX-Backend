import mongoose from "mongoose";

const productSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category",
        required:true
    },
    brand: { 
        type: String
     },




},{timestamps:true})


export const Product=mongoose.model("product",productSchema)