import jwt from 'jsonwebtoken'
import ApiError from "../Utils/ApiError.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { User } from "../Models/user.model.js";


const VerifyJwt = asyncHandler(async (req, res, next) => {

    const incommingToken = req.cookies?.token || req.cookies?.mycookie
    // const incommingToken = req.cookies?.mycookie

    // it means user deos not have token and trying to access a protected resource.

    if (!incommingToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    const decodedToken = jwt.verify(incommingToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("Error verifing the token :", err)
        }
        else {
            // console.log("the decoded is ",decoded)
            return decoded;
        }
    });


    if (!decodedToken) {
        throw new ApiError(401, "Invalid access Token")
    }

    const user = await User.findById(decodedToken._id).select("-password -email");

    req.user = user;
    
    next();



})

export default VerifyJwt