import { getItemsLogic } from "../services/inventory.service.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getInventoryController = asyncHandler(async (req, res) => {
  const items = await getItemsLogic()
  return res.status(200).json(
    new ApiResponse(200, items, "Items Fetch Successfully")
  )
})


export const updateInventoryController = asyncHandler(async (req, res) => {

  const items = await updateItemLogic()

  return res.status(200).json(
    new ApiResponse(200, items, "Stock updates Successfully")
  )
})

export const createInventoryController = asyncHandler(async(req, res)=>{


})
