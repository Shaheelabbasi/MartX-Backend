import { User } from "../Models/user.model.js";

import ApiResponse from "../Utils/Apiresponse.js";
import Apierror from '../Utils/ApiError.js'
import { asyncHandler } from "../Utils/asyncHandler.js";
import OtpGenerator from 'otp-generator'
import { OTP } from "../Models/otp.model.js";
const SignUp = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;


  if ([username, email, password].some((filed) => filed.trim() === "")) {
    throw new ApiError(400);
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  })
  if (existingUser) {
    throw new ApiError(400, "Username or email already exists")
  }
  // create returns nothing so the select method does not work here
  // we can use it with find and find by id for a particular user.



  const newUser = await User.create({
    username,
    email,
    password
  })



  if (!newUser) {

    throw new ApiError(500, "something went wrong while registering the user")
  }
  const safeUser = await User.findById(newUser._id).select("-password -email")


  return res.json(new ApiResponse(200, safeUser, "user created successfully"))



})


const Login = asyncHandler(async (req, res) => {

  const { email, password, username } = req.body;

  if (!((email || username) && password)) {
    throw new ApiError(400, "email and password are required");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  })
  if (!existingUser) {
    throw new ApiError(400, "User not found")
  }

  const passwordStatus = await existingUser.IspasswordCorrect(password)


  if (!passwordStatus) {
    throw new ApiError(400, "Incorrect password")
  }
  const AccessToken = existingUser.GenerateAccessToken()

  // we can also send user details  of a use to frontend
  // such as profile picture etc excluding passwords.
  const safeUser = await User.findById(existingUser._id).select("-password -email")
  const options = {
    httpOnly: true,
    maxAge:24*60*60*1000
  }
   res.cookie("mycookie", AccessToken, options)

   return res.
    json(
      new ApiResponse(200,
        {AccessToken,
        safeUser},
        // if we give variable only it goes to the apiresponse class data
        // single variable is avb using res.data
        // for object
        // for sending multiple details we will have to use an object
        "logged in sucessfully")
    )


})

const logout = (req, res) => {
  const options = {
    httpOnly: true,
  }
  return res.clearCookie("mycookie",options).
  status(200).
    json(
      200,
      "logged out successfully"
    )
}


const ForgetPassword=asyncHandler(async(req,res)=>{

  const {email}=req.body

  const existingUser=await User.findOne({email})

  if(!existingUser)
  {
      throw new Apierror(400,"User does not exist")
  }
 

  const otp=OtpGenerator.generate(6,{ upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false })

  const ans=await OTP.create({
    email,
    otp
  })

  res.json(
    new ApiResponse(
      200,
      `please verify the otp we have sent to ${email}`

    )
  )


})


const VerifyOtp=asyncHandler(async(req,res)=>{
const {otp}=req.body;

const existingOtp=await OTP.findOne({otp})

if(!existingOtp)
{
  throw new Apierror(400,"otp is expired or invalid")
}

if(!existingOtp.otp == otp)
{
  throw new Apierror(400,"otps dont match")
   
}

res.json(
  new ApiResponse(
      200,
      "otp verified successfully"

  )
)

})


const resetPassword=asyncHandler(async(req,res)=>{

const{email,newpassword}=req.body

if(!email || !newpassword)
{
  throw new Apierror(400,"please provide all the credentials")
}
const  existingUser=User.findOne({email})


if(!existingUser)
{
  throw new Apierror(400,'please provide valid email address')
}


existingUser.password=newpassword
const updatedUser=await existingUser.save();
if(!updatedUser)
{
  throw new Apierror(500,"Error updating the userpassword")
}

res.json(
  new ApiResponse(
    200,
    updatedUser,
    "successfully updated password "
  )
)


})

export {
  SignUp,
   Login,
  logout,
  ForgetPassword,
  VerifyOtp
}
