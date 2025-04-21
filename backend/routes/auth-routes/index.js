import { Router } from "express";
import { registerUser, loginUser } from "../../controllers/auth-controller/index.js";
import {authenticate} from "../../middleware/auth-middleware.js"
import { ApiResponse } from "../../utils/ApiResponse.js";
import { httpCodes } from "../../constants.js";
const authRoutes = Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-auth", authenticate, (req, res) => {
    res.status(200).json(new ApiResponse(httpCodes.ok,req.user,"authenticated user"))
})


export { authRoutes };