import { Router } from "express";
import { httpCodes } from "../../constants.js";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../../controllers/auth-controller/index.js";
import { authenticate } from "../../middleware/auth-middleware.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
const authRoutes = Router();

authRoutes.route("/register").post(registerUser);
authRoutes.route("/login").post(loginUser);
authRoutes.route("/check-auth").get(authenticate, (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(httpCodes.ok, req.user, "authenticated user"));
});
authRoutes.route("/logout").post(authenticate, logoutUser);

export { authRoutes };
 