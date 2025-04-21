import { httpCodes } from "../../constants.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import { ApiError } from "../../utils/ApiError.js";
import { prisma } from "../../prisma/index.js";
import { sendVerificationEmail } from "../../utils/email.js";
import {validateUserDetails} from "../../utils/validate.js"
import jwt from "jsonwebtoken"
const registerUser = async (req, res) => {
    let { userName, userEmail, password, role } = req.body;
 
    if (validateUserDetails(userName, userEmail, password, role)) {
        res.status(httpCodes.badRequest)
            .json(new ApiError(httpCodes.badRequest, "Invalid data "));
    };
    const existingUser = await prisma.user.findUnique(
        {
            where: {
                or: [{ userName }, { userEmail }]
            }
        }
    );
    if (existingUser) {
        res.status(httpCodes.badRequest).json(new ApiError(httpCodes.badRequest, "user with this email already exists"));
    }
    await sendVerificationEmail(userEmail);
    password = bcrypt.hash(password, process.env.HASH_ROUNDS);
    const createdUser = await prisma.user.create({
        data: {
            userName,
            userEmail,
            password,
            role
        }
        
    });
    res.status(httpCodes.created).json(new ApiResponse(httpCodes.created, createdUser, "user created succesfully"))

};
const loginUser = async (req, res) => {
    const { userEmail, password } = req.body;
    
    if (!(userEmail && password)) {
        throw new ApiError(httpCodes.badRequest, "user credential cannot be null");
    }
    const user = await prisma.findUnique({
        where: {
            userEmail
        }
    });
    
    if (!user) { throw new ApiError(httpCodes.notFound, "User with this email doesnot exist"); }
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) { throw new ApiError(httpCodes.badRequest, "Invalid User Credentials"); }

    const accessToken = jwt.sign({
        id: user.id,
        userEmail: user.userEmail,
        userName: user.userName,
        role:user.role
        
    }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
    res.status(httpCodes.ok).json(
      new ApiResponse(httpCodes.ok, {
        id: user.id,
        userEmail: user.userEmail,
        userName: user.userName,
        role: user.role,
      },"successfully logged in user")
    );



}


export {
    registerUser,
    loginUser
}