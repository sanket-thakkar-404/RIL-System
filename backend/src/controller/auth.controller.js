import config from "../config/dotenv.config.js";
import { createAdminLogic, loginAdminLogic } from "../services/auth.service.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const CreateAdminController = asyncHandler(async (req, res) => {

  const { admin } = await createAdminLogic(req.body)


  return res.status(201).json(
    new ApiResponse(201, admin, "Admin Created Successfully")
  )
})

export const loginAdminController = asyncHandler(async (req, res) => {

  const { admin, token } = await loginAdminLogic(req.body)

  res.cookie("token", token, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(200).json(
    new ApiResponse(200, admin, "Admin Login Successfully")
  )

})

export const getAdminController = asyncHandler(async (req, res) => {
  const admin = req.admin
  return res.status(200).json(
    new ApiResponse(200, admin, "Admin Fetch successfully")
  )
})

export const logoutAdminController = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Admin Logout Successfully"
    )
  );
})
