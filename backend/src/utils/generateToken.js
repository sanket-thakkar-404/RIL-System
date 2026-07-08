import jwt from "jsonwebtoken";
import { ApiError } from "./apiError.js";

// generate token
export const generateToken = (adminId, secretKey, secretKeyExpire) => {
  try {
    return jwt.sign(
      { adminId },
      secretKey,
      {
        expiresIn: secretKeyExpire || "7d",
      }
    );
  } catch (error) {
    throw new ApiError(500, "Token generation failed");
  }
};


// verify token
export const verifyToken = (token, secretKey) => {
    if (!token) {
      throw new ApiError(401, "Token is required")
    }
    let decoded;
    try {
      const decoded = jwt.verify(token, secretKey)
      // console.log(decoded)
      return decoded;
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw new ApiError(401, "Token expired, please login again");
      }

      if (err.name === "JsonWebTokenError") {
        throw new ApiError(401, "Invalid token");
      }
    }


};