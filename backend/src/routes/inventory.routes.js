import express from "express"
import { getInventoryController } from "../controller/inventory.controller.js"


const inventoryRoutes = express.Router()

inventoryRoutes.get("/", getInventoryController)



export default inventoryRoutes