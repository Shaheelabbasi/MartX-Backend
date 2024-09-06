import dotenv from 'dotenv'
dotenv.config({ path: "./.env" })
import { asyncHandler } from "../Utils/asyncHandler.js";
import ApiResponse from "../Utils/Apiresponse.js";
import Apierror from "../Utils/ApiError.js";
import { Cart } from "../Models/cart.model.js";
import { Product } from "../Models/product.model.js";
import { Stripe } from "stripe";
import { User } from '../Models/user.model.js';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


const getcartTotal = async (data) => {
    let TotalPrice = 0
    for (let i = 0; i < data.length; i++) {
        let cartItem = data[i]
        const foundproduct = await Product.findOne({ _id: cartItem.productId })
        TotalPrice = foundproduct.price * cartItem.quantity
    }

    return TotalPrice


}


function generateLineItems(items) {

    return items.map((item) => (

        {

            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.productId.name,
                },

                unit_amount: item.productId.price * 100
            },
            quantity: item.quantity,
        }
    ))

}
const addTocart = asyncHandler(async (req, res) => {


    const { items } = req.body


    // this is because empty array is considred as true
    if (!items || items.length === 0) {
        throw new Apierror(401, "Please add some items to the cart")
    }

    //check for existing cart


    const existingCart = await Cart.findOne({ User: req.user._id })

    if (existingCart) {
        let existingitem=false
        for (let i = 0; i < existingCart.items.length; i++) {
            let item = existingCart.items[i];

            if (item.productId.toString() == items[0].productId) {
                existingitem=true
                item.quantity += 1
                existingCart.totalAmount += await getcartTotal(items) 
            }
        }
        if(existingitem)
        {
           await  existingCart.save();
          return  res.json(
                new ApiResponse(
                    200,
                    existingCart,
                    "successfully updated cart"

                )
            )
        }

      else{
        existingCart.items.push(items[0])

        existingCart.totalAmount += await getcartTotal(items)
        await existingCart.save()
        res.json(
            new ApiResponse(
                200,
                existingCart,
                "sucessfully added a new item to the cart"
            )
        )

      }
        // adding a new item to the cart
        


     

    }
    else {
        const newcart = await Cart.create({
            User: req.user._id,
            items,
            totalAmount: await getcartTotal(items)
        })





    }


})

const removeFromCart = asyncHandler(async (req, res) => {


    const { productId } = req.body;


    const producttoTobeRemoved = await Product.findById(productId)





})


const HandlePayment = asyncHandler(async (req, res) => {
    const userCart = await Cart.findOne({ User: req.user._id }).populate("items.productId")

    if (!userCart) {
        throw new Apierror(400, "Please add some items to proceed to payment")
    }

    const { items, totalAmount } = userCart

    console.log("items:", items)
    console.log("total:", totalAmount)



    const mylineItems = generateLineItems(items)


    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: mylineItems,
        mode: 'payment',
        success_url: 'https://your-website.com/success',
        cancel_url: 'https://your-website.com/cancel',
    })

    res.json(session.url)

})





export {
    addTocart,
    HandlePayment,

}