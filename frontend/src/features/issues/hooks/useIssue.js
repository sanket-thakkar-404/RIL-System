import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import {
  createIssue,
  getIssue,
  getIssueStatus,
  updateIssueStatus,
} from "../state/issue.thunks";


export const useIssue = () => {

  const dispatch = useDispatch();


  // Redux state
  const {
    issues,
    selectedIssues,
    loading,
    error,
  } = useSelector((state) => state.issue);



  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullname: "",
      email: "",
      department: "",
      description: "",
      items: [],
      unit: ""
    },
  });



  // CREATE ISSUE
  const onSubmitIssue = async (data) => {
    const result = await dispatch(
      createIssue(data)
    );
    if (createIssue.fulfilled.match(result)) {
      reset();
      return result.payload.requestId;
    } else {
      throw new Error(result.payload || "Failed to create issue");
    }
  };



  // GET ALL ISSUE
  const fetchIssues = () => {
    dispatch(getIssue());
  };



  // GET STATUS
  const fetchIssueStatus = (requestId) => {
    return dispatch(
      getIssueStatus(requestId)
    );
  };



  // UPDATE STATUS
  const changeIssueStatus = (
    requestId,
    data
  ) => {
    return dispatch(
      updateIssueStatus({
        requestId,
        data,
      })
    ).unwrap();
  };



  return {
    // react hook form
    register,
    handleSubmit,
    errors,
    control,

    // submit
    onSubmitIssue,

    // state
    issues,
    selectedIssues,
    loading,
    error,

    // actions
    fetchIssues,
    fetchIssueStatus,
    changeIssueStatus,

  };
};