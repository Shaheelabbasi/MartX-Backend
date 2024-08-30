import dotenv from 'dotenv'
dotenv.config({path:"./.env"})
import { asyncHandler } from "./asyncHandler.js";
import nodemailer from "nodemailer";



const sendEmail=async(email,otp)=>{

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_SENDER,
          pass: process.env.MAIL_PASSWORD
        }
      });
      
      var mailOptions = {
        from: process.env.MAIL_PASSWORD,
        to: email,
        subject: 'Your OTP Code for MartX',
        text: `please confirm your otp Here it is ${otp} It is valid for 5 minutes only`
        
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

}


export {
    sendEmail
}