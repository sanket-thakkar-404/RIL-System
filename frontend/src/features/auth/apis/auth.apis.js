import axiosInstance from "../../../config/axiosInstance";


export const loginAPI = async (data) => {
  const res = await axiosInstance.post("/admin/login", data)
  return res.data
}

export const registerAPI = async (data) => {
  const res = await axiosInstance.post("/admin/create", data)
  return res.data
}

export const logoutAPI = async () => {
  const res = await axiosInstance.get("/admin/logout")
  return res.data
}

export const getAPI = async () => {
  const res = await axiosInstance.get("/admin/get-me")
  return res.data
}
