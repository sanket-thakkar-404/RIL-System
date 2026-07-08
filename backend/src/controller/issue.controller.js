import { createIssueLogic, getIssueLogic, getIssueStatusLogic, updateStatusLogic } from "../services/issue.service.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createIssueController = asyncHandler(async (req, res) => {

  const data = req.body;
  const issue = await createIssueLogic(data)

  return res.status(201).json(
    new ApiResponse(201, issue, "New Issue Create successfully")
  )
})

export const getIssueController = asyncHandler(async (req, res) => {

  const issues = await getIssueLogic()

  return res.status(200).json(
    new ApiResponse(200, { issues, totalIssues: issues.length }, "Issues Fetch successfully")
  )
})

export const getIssueStatusController = asyncHandler(async (req, res) => {

  const id = req.params

  const issue = await getIssueStatusLogic(id)


  return res.status(200).json(
    new ApiResponse(200, issue, "Status fetch successfully")
  )
})

export const updateStatusController = asyncHandler(async (req, res) => {

  const { id } = req.params
  const admin = req.admin
  const { status, data } = req.body

  const issue = await updateStatusLogic(id, data, status, admin)

  return res.status(200).json(
    new ApiResponse(200, issue, "issues Status Updated")
  )

})

