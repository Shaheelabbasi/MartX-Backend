
import mongoose from "mongoose";
import { sendEmail } from "../Utils/Mail.js";
const otpSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 2, // The document will be automatically deleted after 5 minutes of its creation time
    },
  });


  async function sendVerificationEmail(email,otp)
  {
    try {
        await sendEmail(email,otp)
        console.log("mail sent successfully")
    } catch (error) {
        console.log("Error sending the mail",error)
    }
       
  }

  otpSchema.pre("save",async function(next){

        if(this.isNew)
        {
     
           await sendVerificationEmail(this.email,this.otp)
           next();
        }
        next();
  })

  export const OTP=mongoose.model("Otp",otpSchema)