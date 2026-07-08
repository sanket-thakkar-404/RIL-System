import { body } from "express-validator";
import { validate } from "./issue.validate.js";


export const createAdminValidator = [
  body("fullname")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name must be minimum 3 characters"),

  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be minimum 3 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be minimum 6 characters"),

  body("role")
    .optional()
    .isIn(["admin", "user"])
    .withMessage("Invalid role"),

  validate
];

export const loginAdminValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be minimum 6 characters"),

  validate
];