import mongoose from "mongoose";


// creating a cart table or collection
// one indival object inside the cart would be a document or a row
const cartSchema=new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    items:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"product",
                required:true
            },
            quantity:{
                type:Number,
                required:true
            }

        }

    ],
    totalAmount: { type: Number,required:true },

},{timestamps:true})


export const Cart=mongoose.model("cart",cartSchema)