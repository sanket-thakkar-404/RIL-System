import axiosInstance from "../../../config/axiosInstance"


export const createIssueAPI = async (data) => {
  const res = await axiosInstance.post("/issues/create", data)
  return res.data
}

export const getIssueAPI = async () => {
  const res = await axiosInstance.get("/issues/")
  return res.data
}

export const getIssueStatusAPI = async (id) => {
  const res = await axiosInstance.get(`/issues/${id}`)
  return res.data
}

export const updateIssueStatusAPI = async (id, data) => {
  const res = await axiosInstance.patch(`/issues/${id}`, data)
  return res.data
}

