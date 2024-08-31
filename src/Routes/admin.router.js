import express from "express"
import { createCategory,getCategories ,insertProducts,searchProducts,getAllProducts} from "../Controllers/admin.controller.js";
const adminRouter=express.Router();
import { VerifyAdmin } from "../Middlewares/admin.middleware.js";
import VerifyJwt from "../Middlewares/auth.middleware.js";


adminRouter.post("/createcategory",VerifyJwt,VerifyAdmin,createCategory)
adminRouter.get("/getallcategories",VerifyJwt,VerifyAdmin,getCategories)
adminRouter.post("/insertproduct",VerifyJwt,VerifyAdmin,insertProducts)
adminRouter.get("/searchproducts",VerifyJwt,VerifyAdmin,searchProducts)
adminRouter.get("/getAllProducts",VerifyJwt,VerifyAdmin,getAllProducts)




export{adminRouter}