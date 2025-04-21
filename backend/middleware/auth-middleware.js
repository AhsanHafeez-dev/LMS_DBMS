import { httpCodes } from "../constants";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken"
const verfiyToken = async (secret, token) => {
    return await jwt.verify(token,secret)
 }
const authenticate = async (req, res, next) => {
    const authHeader = req.header.authorization;
    if (!header) {
        throw new ApiError(httpCodes.unauthorized,"user is not authenticated")
    }
    const token = authHeader.split(' ')[1];
    const payload = await verfiyToken(process.env.ACCESS_TOKEN_SECRET, token);
    req.user = payload;
    next();

}
export { authenticate };