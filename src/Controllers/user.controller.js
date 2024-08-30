import dotenv from 'dotenv'
dotenv.config({path:"./.env"})
import { asyncHandler } from "../Utils/asyncHandler.js";
import ApiResponse from "../Utils/Apiresponse.js";
import Apierror from "../Utils/ApiError.js";
import { Cart } from "../Models/cart.model.js";
import { Product } from "../Models/product.model.js";
import {Stripe} from "stripe";
import { User } from '../Models/user.model.js';

 const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)


const getcartTotal=async(data)=>{
    let TotalPrice=0

for(let i=0;i<data.length;i++)
{
    // since data is an array we cnnot use data.productId directly
    // it will give undefined
    // we assign the first object to the item variable 
    // and then access the product id 
   let item=data[i]
    const product=await Product.findById(item.productId)
    if(product)
    {
       TotalPrice+=product.price*item.quantity
    }
}

return TotalPrice;


}


function generateLineItems(items){
    
  return items.map((item)=>(

         {
           
            price_data: {
              currency: 'inr',
              product_data: {
                name: item.productId.name,
              },
           
              unit_amount:  item.productId.price*100
            },
            quantity: item.quantity,
          }
   ) )

}
const addTocart=asyncHandler(async(req,res)=>{


    const{items}=req.body

    // this is because empty array is considred as true
if(!items || items.length ===0)
{
    throw new Apierror(401,"Please add some items to the cart")
}

//check for existing cart


const existingCart=await Cart.findOne({User:req.user._id})

if(existingCart)
{
    const duplicatingItems=existingCart.items.filter((existingItem)=>items.some((value)=>
        value.productId.toString()==existingItem.productId.toString()))


    if(duplicatingItems.length>0)
    {
        throw new Apierror(400,"one or more items already exist in the cart")
    }
    const cartTotal=await getcartTotal(items)

    existingCart.items.push(...items)

    // suppose two items are already there they have price of 100 and new item price would be added
    // up to them  so we sue +=
    existingCart.totalAmount+=cartTotal

    await existingCart.save()

    const populatedCart=await Cart.findById(existingCart._id).populate("User").populate("items.productId")

    if(!populatedCart)
    {
        throw new Apierror(500,"Error populating the cartItems")
    }

    res.json(
        new ApiResponse(
            200,
            populatedCart,
            "successfully added items to the cart"
        )
    )
}
else
{
   
    const cartTotal=await getcartTotal(items)
    const newcart=await Cart.create({
        User:req.user._id,
        items,
        totalAmount:cartTotal

    })

    const popoulatedCart=await Cart.findById(newcart._id).populate("User").populate("items.productId")

    if(!popoulatedCart)
    {
        throw new Apierror(500,"Error populating the cart Items")
    }
    res.json(
        new ApiResponse(
            200,
            popoulatedCart,
            "successfully created a new cart"
        )
    )
}


})

const removeFromCart=asyncHandler(async(req,res)=>{


    const{productId}=req.body;


    const producttoTobeRemoved=await Product.findById(productId)





})


const HandlePayment=asyncHandler(async(req,res)=>{
const userCart=await Cart.findOne({User:req.user._id}).populate("items.productId")

if(!userCart)
{
    throw new Apierror(400,"Please add some items to proceed to payment")
}

const{items,totalAmount}=userCart

console.log("items:",items)
console.log("total:",totalAmount)



const mylineItems=generateLineItems(items)


    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: mylineItems,
        mode: 'payment',
        success_url: 'https://your-website.com/success',
        cancel_url: 'https://your-website.com/cancel',
      })

      res.json(session.url)

})





export{
    addTocart,
    HandlePayment,
    
}