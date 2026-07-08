import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
} from "../state/inventory.thunks";
import { useCallback } from "react";


export const useInventory = () => {

  const dispatch = useDispatch();

  // Redux State
  const {
    items,
    selectedItem,
    loading,
    error,
  } = useSelector(
    (state) => state.inventory
  );

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productId: "",
      productName: "",
      category: "",
      stock: "",
      unit: "",
    }
  });


  // ================= CREATE =================
  const onSubmitInventory = async (data) => {
    const result = await dispatch(
      createInventory(data)
    );

    if (
      createInventory.fulfilled.match(result)
    ) {
      reset();
    }
  };


  // ================= GET =================
  const fetchInventory = useCallback(() => {
    // console.log("API CALL")
    dispatch(getInventory())
  }, [dispatch])


  // ================= UPDATE =================
  const editInventory = (
    productId,
    data
  ) => {
    dispatch(
      updateInventory({
        productId,
        data,
      })
    );
  };

  // ================= DELETE =================
  const removeInventory = (
    productId
  ) => {
    dispatch(
      deleteInventory(productId)
    );
  };

  // ================= SET EDIT DATA =================
  const setEditData = (item) => {

    setValue(
      "productId",
      item.productId
    );

    setValue(
      "productName",
      item.productName
    );

    setValue(
      "category",
      item.category
    );

    setValue(
      "stock",
      item.stock
    );

    setValue(
      "unit",
      item.unit
    );

  };

  return {
    // form
    register,
    handleSubmit,
    errors,
    reset,

    // submit
    onSubmitInventory,

    // redux state
    items,
    selectedItem,
    loading,
    error,

    // actions
    fetchInventory,
    editInventory,
    removeInventory,
    setEditData,
  };
};