import mongoose from "mongoose";

const cartSchema=new mongoose.Schema({

    User:{
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
                required:true,
                default:1
            }

        }

    ],
    totalAmount: { type: Number },

},{timestamps:true})


export const Cart=mongoose.model("cart",cartSchema)