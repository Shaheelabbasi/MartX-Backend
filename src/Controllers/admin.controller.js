import { asyncHandler } from "../Utils/asyncHandler.js";
import { Category } from "../Models/category.model.js";
import ApiResponse from "../Utils/Apiresponse.js";
import Apierror from "../Utils/ApiError.js";
import { Product } from "../Models/product.model.js";

const createCategory=asyncHandler(async(req,res)=>{

    const categories = [
        { name: "Electronics", description: "Devices and gadgets including smartphones, laptops, cameras, and audio equipment." },
        { name: "Clothing", description: "Apparel for men, women, and children, including shirts, pants, dresses, and accessories." },
        { name: "Home & Kitchen", description: "Products for home improvement and kitchen needs, such as appliances, cookware, and furniture." },
        { name: "Books", description: "A wide range of books including fiction, non-fiction, textbooks, and educational materials." },
        { name: "Toys & Games", description: "Toys and games for children and adults, including action figures, puzzles, board games, and educational toys." },
        { name: "Beauty & Personal Care", description: "Products related to personal grooming and beauty, such as skincare products, cosmetics, and hair care items." }
      ];

     const resposne= await Category.insertMany(categories)
})




const getCategories=asyncHandler(async(req,res)=>{

    const allcategories=await Category.find({}).select("-description -createdAt -updatedAt")

    return res.json(
        new ApiResponse(
            200,
            allcategories,
            "successfully fetched all categories"
        )
    )
})

const insertProducts=asyncHandler(async(req,res)=>{

    // id is sent as a string 
    // it is automatically converted in to objectId
    const{name,description,price,stock,category,brand}=req.body
// it checks if the price and stock are empty or not
    if(!price || ! stock)
    {
        throw new Apierror(401,"Please provide category and stock value")
    }

    // find method works only with the string
    if([name,description,brand,category].find((field)=>field.trim() === ""))
    {
        throw new Apierror(400,"All fields are required")
    }

    const existingProduct=await Product.findOne({
        name,
        category
    })

    if(existingProduct)
    {
        throw new Apierror(401,"the product already exists in the database ")
    }

    const createdProduct=await Product.create({
        name,
        description,
        price,
        stock,
        category,
        brand
    })


    const populatedProduct=await Product.findById(createdProduct._id).populate("category")

    if(!createdProduct)
    {
        throw new Apierror(500,"Error creating the product")
    }


    res.json(
        new ApiResponse(
            200,
            populatedProduct,
            "product added successfully"
        )
    )

})

const searchProducts=asyncHandler(async(req,res)=>{

const searchQuery={
name:{$regex:req.query.name,$options:"i"}
}

const searchResults=await Product.find(searchQuery).populate("category","-createdAt -updatedAt")

if(!searchResults)
{
    throw new Apierror(401,"no product found")
}


res.json(
    new ApiResponse(
        200,
        searchResults,
        "searched successfully"

    )
)

})

const getAllProducts=asyncHandler(async(req,res)=>{
// variables from querty object is always a string
    const criteria=parseInt(req.query.sort)
    const searchQuery={}
    if(!criteria)
    {
        const allProducts=await Product.find(searchQuery).populate("category","-createdAt -updatedAt")

        res.json(
            new ApiResponse(
                200,
                allProducts,
                "fetched products succesfully"
            )
        )

    }

    const sortedProducts=await Product.find(searchQuery).sort({price:criteria}).limit(1)

    res.json(
        new ApiResponse(
            200,
            sortedProducts,
            "successfully fetched sorted products"
        )
    )





})



export{
    createCategory,
    getCategories,
    insertProducts,
    searchProducts,
    getAllProducts
}