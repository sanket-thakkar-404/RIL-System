import { sheets } from "../config/google.config.js";


export const getSheetData = async (range, spreadsheetId) => {
  const res = await sheets.spreadsheets.values.get({
    range,
    spreadsheetId,
  })

  return res.data.values || []
}



export const appendSheetData = async (range, spreadsheetId, values) => {
  const res = await sheets.spreadsheets.values.append({
    range,
    spreadsheetId,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values,
    }
  })

  return res.data
}


export const updateSheetData = async (range, spreadsheetId, values) => {
  const res = await sheets.spreadsheets.values.update({
    range,
    spreadsheetId,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values,
    }
  })
  return res.data
}

