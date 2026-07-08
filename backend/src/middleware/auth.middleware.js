import config from "../config/dotenv.config.js";
import adminModel from "../model/admin.model.js";
import { ApiError } from "../utils/apiError.js";
import { verifyToken } from "../utils/generateToken.js";


export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    // console.log(token)

    if (!token) {
      throw new ApiError(401, "Please login first")
    }

    const decoded = verifyToken(token, config.TOKEN_SECRET);
    // console.log(decoded)

    const admin = await adminModel
      .findById(decoded.adminId)
      .select("-password");

    if (!admin) {
      throw new ApiError(401, "Admin not found")
    }

    req.admin = admin;
    next();

  } catch (error) {
    // console.log(error)
    throw new ApiError(401, "Invalid token")
  }
}; 