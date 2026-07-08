import axiosInstance from "../../../config/axiosInstance";


// ================= GET INVENTORY =================
export const getInventoryAPI = async () => {
  const res = await axiosInstance.get(
    "/inventory/"
  );
  return res.data;
};

// ================= CREATE INVENTORY =================
export const createInventoryAPI = async (data) => {
  const res = await axiosInstance.post(
    "/inventory/create",
    data
  );
  return res.data;
};


// ================= UPDATE INVENTORY =================
export const updateInventoryAPI = async (
  productId,
  data
) => {
  const res = await axiosInstance.patch(
    `/inventory/${productId}`,
    data
  );
  return res.data;
};




// ================= DELETE INVENTORY =================
export const deleteInventoryAPI = async (
  productId
) => {
  const res = await axiosInstance.delete(
    `/inventory/${productId}`
  );
  return res.data;

};