import express from "express"
import { CreateAdminController, getAdminController, loginAdminController, logoutAdminController } from "../controller/auth.controller.js"
import { createAdminValidator, loginAdminValidator } from "../validator/auth.validate.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const authRoutes = express.Router()

authRoutes.post("/create", createAdminValidator, CreateAdminController)
authRoutes.post("/login", loginAdminValidator, loginAdminController)
authRoutes.get("/get-me", authMiddleware, getAdminController)
authRoutes.get("/logout", logoutAdminController)


export default authRoutes