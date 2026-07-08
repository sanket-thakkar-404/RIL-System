import config from "../config/dotenv.config.js";
import { ApiError } from "../utils/apiError.js";


const errorMiddleware = (err, req, res, next) => {

  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || 500;

    const message =
      error.message || "Internal Server Error";

    error = new ApiError(
      statusCode,
      message,
      error?.errors || [],
      error.stack
    );

  }

  return res
    .status(error.statusCode)
    .json({
      success: false,
      message: error.message,
      errors: error.errors,
      stack:
        config.NODE_ENV === "development"
          ? error.stack
          : undefined
    });

};


export { errorMiddleware };