import config from "../config/dotenv.config.js";

export const INVENTORY = {
  ID: config.INVENTORY_SPREADSHEET_ID,
  Range: {
    STOCK: "Stock!A2:F",
    Approved: "Approved!A2:K",
    Received: "Received!A2:K",
    Rejected: "Rejected!A2:K"
  }
}