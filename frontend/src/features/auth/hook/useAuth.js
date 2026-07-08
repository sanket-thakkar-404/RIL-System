import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import {
  loginAdmin,
  logoutAdmin,
  getAdmin,
} from "../state/auth.thunks";

import { clearError } from "../state/auth.slice";
import { useNavigate } from "react-router";
import { toast } from "sonner";


export const useAuth = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();


  // react hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });


  // redux state
  const {
    user,
    loading,
    isAuthenticated,
  } = useSelector((state) => state.auth);



  // LOGIN SUBMIT
  const onLoginSubmit = async (data) => {
    try {
      const result = await dispatch(
        loginAdmin(data)
      );
      if (loginAdmin.fulfilled.match(result)) {
        toast.success(
          "Login successfully"
        );
        reset();
        navigate("/admin");
      } else {
        toast.error(result.payload || "Login failed");
      }
      return result;
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };



  // FETCH ADMIN
  const fetchAdmin = useCallback(
    async () => {
      return await dispatch(
        getAdmin()
      );
    },
    [dispatch]
  );



  // LOGOUT
  const logout = useCallback(
    async () => {
      return await dispatch(
        logoutAdmin()
      );
    },
    [dispatch]
  );



  // CLEAR ERROR
  const resetError = useCallback(
    () => {
      dispatch(clearError());
    },
    [dispatch]
  );



  // refresh check
  useEffect(() => {

    fetchAdmin();

  }, [fetchAdmin]);



  return {

    // react hook form
    register,
    handleSubmit,
    errors,
    isSubmitted,

    // navigate
    navigate,


    // redux state
    user,
    loading,
    isAuthenticated,


    // actions
    onLoginSubmit,
    logout,
    fetchAdmin,
    resetError,

  };

};