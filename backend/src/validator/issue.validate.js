import { validationResult } from "express-validator";
import { body } from "express-validator";
import { ApiError } from "../utils/apiError.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map((error) => {
    return {
      field: error.path,
      message: error.msg,
    };
  });

  throw new ApiError(
    400,
    "Validation Failed",
    extractedErrors
  );
};


export const createIssueValidator = [
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Full Name is Required")
    .isLength({ min: 3 })
    .withMessage("Full Name must be at least 3 characters"),

  body("department")
    .trim()
    .notEmpty()
    .withMessage("Department is Required"),

  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required"),

  body("items.*.productId")
    .notEmpty()
    .withMessage("Product Id is Required"),

  body("items.*.productName")
    .trim()
    .notEmpty()
    .withMessage("Product Name is Required"),

  body("items.*.qty")
    .notEmpty()
    .withMessage("Quantity is Required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be minimum 1"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is Required")
    .isLength({ min: 10 })
    .withMessage("Description must be minimum 10 characters"),

  validate
];


