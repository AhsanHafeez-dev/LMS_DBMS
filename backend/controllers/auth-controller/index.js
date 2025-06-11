import { httpCodes,secureCookieOptions } from "../../constants.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import { ApiError } from "../../utils/ApiError.js";
import { prisma } from "../../prisma/index.js";
import { sendVerificationEmail } from "../../utils/email.js";
import {validateUserDetails} from "../../utils/validate.js"
import jwt from "jsonwebtoken"


const registerUser = async (req, res) => {
    
    console.log("revieved data ", req.body);
    
    let { userName, userEmail, password, role } = req.body;
    const registrationEmailHTML = `<div style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>
        <h2 style='color: #2d89ef;'>Welcome to Duet Learn!</h2>
        <p>Hi ${userName},</p>
        <p>Thank you for registering with us. We're excited to have you onboard!</p>
        <p>You can now explore our courses, track your progress, and grow your skills.</p>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Happy learning!</p>
        <br>
        <p>– The Duet Learn Team</p>
        </div>
        `;
    let registrationText ="Thank you for registering with us. We're excited to have you onboard! You can now explore our courses, track your     progress, and grow your skills.If you have any questions, feel free to reach out to our support team. Happy learning";
    
    if (!validateUserDetails(userName, userEmail, password, role)) {
      console.log("invalid data");
      res
        .status(httpCodes.badRequest)
        .json(new ApiError(httpCodes.badRequest, "Invalid data "));
      return;
    }
    const existingUser = await prisma.user.findFirst({
      where: {
        userName,
        userEmail,
      },
    });

    if (existingUser) {
      console.log("user already exist returning error");
      res
        .status(httpCodes.badRequest)
        .json(
          new ApiError(
            httpCodes.badRequest,
            "user with this email already exists"
          )
        );
      return;
    }


    if (userEmail.endsWith("students.duet.edu.pk")) {
      console.log("registering student");
    
        role = "student";
    } else {
      console.log("registering teacher");
      role = "instructor";
    }
    

    
        console.log("going to send email functions")
        // await sendVerificationEmail(userEmail,userName,"Registration successfull",registrationEmailHTML,registrationText);
    
    
    
    
    password = await bcrypt.hash(password, 10);
    console.log("encryoted password");
    
    

    const createdUser = await prisma.user.create({
        data: {
            userName,
            userEmail,
            password,
            role
        }
        
    });
    console.log("user created successfully");
    res.status(httpCodes.created).json(new ApiResponse(httpCodes.created, createdUser, "user created succesfully"));
    console.log("sending response")
    return;

};
const loginUser = async (req, res) => {
    console.log("handing requestt in auth-controller/login controller")
    console.log("data got ",req.body);
    const { userEmail, password } = req.body;
    
    if (!(userEmail && password)) {
        console.log("invalid user credentials sending error");
        throw new ApiError(httpCodes.badRequest, "user credential cannot be null");
        return;
    }
    console.log("quering db");
    const user = await prisma.user.findUnique({
        where: {
            userEmail
        }
    });
    console.log("got db response")
    
    if (!user) { console.log("userNotFound"); throw new ApiError(httpCodes.notFound, "User with this email doesnot exist"); return; }
    console.log("user founded");
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log("password not correct");
    if (!isPasswordCorrect) {  return res.status(httpCodes.badRequest).json(new ApiResponse(httpCodes.badRequest,{},"wrong password")); }
    console.log("password is correct");
    const accessToken = jwt.sign({
        id: user.id,
        userEmail: user.userEmail,
        userName: user.userName,
        role:user.role
        
    }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
    console.log("generated token");
    res
      .status(httpCodes.ok)
      .cookie("accessToken", accessToken,secureCookieOptions)
      .json(
        new ApiResponse(
          httpCodes.ok,
          {
            id: user.id,
            userEmail: user.userEmail,
            userName: user.userName,
            role: user.role,
            accessToken,
          },
          "successfully logged in user"
        )
      );

    console.log("sending response")
    return;



}

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Logs out the authenticated user by clearing the access token cookie.
 * Sends a response with no content status indicating successful logout.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

/*******  bd61bdb5-0ad4-4acc-a6e3-0be504e27f5e  *******/
const logoutUser = async (req, res) => {
    console.log("logging out user");
    res.status(httpCodes.noContent).clearCookie("accessToken",secureCookieOptions).json(new ApiResponse(httpCodes.noContent, {}, "logout successfully"));
    return;

}

export {
    registerUser,
    loginUser,
    logoutUser
}