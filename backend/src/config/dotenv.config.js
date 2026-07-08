/**
 * @file config/index.js
 * @description
 * Centralized application configuration module.
 *
 * Responsibilities:
 * 1. Loads environment variables from the `.env` file.
 * 2. Validates that all required environment variables are present.
 * 3. Exposes a single immutable configuration object.
 *
 * Why this approach?
 * - Prevents scattered `process.env` usage across the codebase.
 * - Fails fast during application startup if configuration is missing.
 * - Improves maintainability and testability.
 * - Follows industry-standard backend architecture.
 */

import dotenv from "dotenv";

// Load variables from .env into process.env
dotenv.config();

/**
 * List of environment variables that are mandatory for the application.
 * If any key is missing, the application will terminate during startup.
 */
const REQUIRED_ENV_VARS = [
  // Port
  "PORT",

  // Mongoose Connection
  "MONGO_URI",

  // Token
  "TOKEN_SECRET",
  "TOKEN_EXPIRE",

  // environment variable
  "NODE_ENV",

  // Frontend Url
  "FRONTEND_URL",

  // Google CREDENTIALS
  "GOOGLE_CREDENTIALS",

  // google SpreadSheet ID
  "INVENTORY_SPREADSHEET_ID",

  // mail Server
  "EMAIL_USER",
  "EMAIL_PASS",
];

/**
 * Validates that all required environment variables exist.
 *
 * @throws {Error} If any required environment variable is missing.
 */
function validateEnvironmentVariables() {
  const missingVariables = REQUIRED_ENV_VARS.filter(
    (key) => !process.env[key]
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(", ")}`
    );
  }
}

/**
 * Run validation immediately during application startup.
 * This ensures configuration issues are detected before the server starts.
 */
validateEnvironmentVariables();

/**
 * Immutable application configuration object.
 *
 * Use this object throughout the application instead of directly
 * accessing `process.env`.
 *
 * Example:
 * import config from "./config/dotenv.config.js";
 * console.log(config.PORT);
 */
const config = Object.freeze({

  // Application
  PORT: Number(process.env.PORT),

  // Database
  MONGO_URI: process.env.MONGO_URI,

  // token
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  TOKEN_EXPIRE: process.env.TOKEN_EXPIRE,


  // environment variable
  NODE_ENV: process.env.NODE_ENV,

  // Frontend Url
  FRONTEND_URL: process.env.FRONTEND_URL,

  // google Credentials
  GOOGLE_CREDENTIALS: process.env.GOOGLE_CREDENTIALS,

  // Google Sheet id
  INVENTORY_SPREADSHEET_ID: process.env.INVENTORY_SPREADSHEET_ID,

  // Mail Services
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_USER: process.env.EMAIL_USER,
});

export default config;