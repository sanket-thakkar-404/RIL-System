import express from "express"
import { createIssueValidator } from "../validator/issue.validate.js"
import { createIssueController, getIssueController, getIssueStatusController, updateStatusController } from "../controller/issue.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"


const issuesRoutes = express.Router()

issuesRoutes.post("/create", createIssueValidator, createIssueController)
issuesRoutes.get("/", getIssueController)
issuesRoutes.get("/:id", getIssueStatusController)
issuesRoutes.patch("/:id", authMiddleware,updateStatusController)




export default issuesRoutes