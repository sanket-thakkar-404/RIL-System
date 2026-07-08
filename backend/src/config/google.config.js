import { google } from "googleapis";
import config from "./dotenv.config.js";


const credentials = JSON.parse(
  Buffer.from(config.GOOGLE_CREDENTIALS, "base64").toString("utf-8")
);


/**
 * Google authentication instance.
 *
 * Scopes:
 * - spreadsheets: Read and write access to Google Sheets.
 * - drive: Read, create, update, and manage files/folders in Google Drive.
 */
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ],
});

/**
 * Authenticated Google Sheets API client.
 *
 * Usage:
 * import { sheets } from "../config/google.config.js";
 */

export const sheets = google.sheets({
  version: "v4",
  auth,
});

/**
 * Authenticated Google Drive API client.
 *
 * Usage:
 * import { drive } from "../config/google.config.js";
 */

export const drive = google.drive({
  version: "v3",
  auth,
});


export default auth;