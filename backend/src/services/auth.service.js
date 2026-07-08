import config from "../config/dotenv.config.js";
import adminModel from "../model/admin.model.js";
import { ApiError } from "../utils/apiError.js";
import { generateToken } from "../utils/generateToken.js";

export const createAdminLogic = async (data) => {
  const { fullname, email, password, username, role } = data;

  // max 2 admins allowed
  const adminCount = await adminModel.countDocuments();
  if (adminCount >= 2) {
    throw new ApiError(403, "Only 2 admins are allowed");
  }

  // check admin already exists
  const existingAdmin = await adminModel.findOne({
    $or: [{ email }, { username }],
  });

  if (existingAdmin) {
    throw new ApiError(409, "Admin already exists");
  }



  // create admin
  const admin = await adminModel.create({
    fullname,
    email,
    password,
    username,
    role,
  });

  // remove password from response
  const adminData = admin.toObject();
  delete adminData.password;

  return {
    success: true,
    message: "Admin created successfully",
    admin: adminData,
  };


};

export const loginAdminLogic = async (data) => {
  const { email, password } = data;

  // check admin already exists
  const admin = await adminModel.findOne({
    email
  }).select("+password");

  if (!admin) {
    throw new ApiError(403, "Invalid credentials")
  }

  // compare Password
  const isMatch = await admin.comparePassword(password)

  if (!isMatch) {
    throw new ApiError(403, "Invalid credentials")
  }

  const token = await generateToken(admin._id, config.TOKEN_SECRET, config.TOKEN_EXPIRE)

  return {
    admin,
    token
  };
};

