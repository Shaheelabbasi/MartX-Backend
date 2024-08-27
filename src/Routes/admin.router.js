import express from "express"
import { createCategory,getCategories ,insertProducts,searchProducts,getAllProducts} from "../Controllers/admin.controller.js";
const adminRouter=express.Router();


adminRouter.post("/createcategory",createCategory)
adminRouter.get("/getallcategories",getCategories)
adminRouter.post("/insertproduct",insertProducts)
adminRouter.get("/searchproducts",searchProducts)
adminRouter.get("/getAllProducts",getAllProducts)




export{adminRouter}