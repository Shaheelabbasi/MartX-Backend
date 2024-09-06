import { asyncHandler } from "../Utils/asyncHandler.js";
import Apierror from "../Utils/ApiError.js";



const VerifyAdmin=asyncHandler(async(req,res,next)=>{

    if(req.user.role == "admin")
    {
   return next()
    }

    throw new Apierror(401,"Unaurthorzed request You are not admin")


})

export {
    VerifyAdmin
}
