import { useState } from "react";
import { useNavigate } from "react-router";
import { useFieldArray } from "react-hook-form";
import { DEPARTMENTS } from "../../../../data/department";
import { Send, X } from "lucide-react";
import { toast } from "sonner";
import { useIssue } from "../../hooks/useIssue";
import ItemSearchAdd from "../components/ItemSearchAdd";
import FormField from "../../../../components/FormField";
import PageHeader from "../../../../components/PageHeader";
import SuccessCard from "../components/SuccessCard";

const errorStyle = {
  marginTop: "4px",
  fontSize: "var(--text-label-sm)",
  color: "var(--color-error)",
};

export default function SubmitRequestPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    errors,
    control,
    onSubmitIssue,
    loading,
  } = useIssue();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const [submittedId, setSubmittedId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [itemsError, setItemsError] = useState("");

  const handleAddItem = (item) => {
    setItemsError("");
    append({
      productId: item.id,
      productName: item.productName,
      category: item.category,
      stock: item.stock,
      qty: "",
    });
  };

  const onSubmit = async (data) => {
    if (fields.length === 0) {
      setItemsError("Please add at least one item to submit a request.");
      toast.error("Please add at least one item");
      return;
    }
    // console.log(data);
    try {
      const result = await onSubmitIssue(data);
      // console.log(result);
      // Generate a mock tracking ID for display
      setSubmittedId(result);
      if (result) {
        toast.success("Request submitted successfully!");
      }
    } catch (err) {
      toast.error("Failed to submit request", err.message);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(submittedId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  // ─── Success screen ─────────────────────────────────────────────────────────
  if (submittedId) {
    return (
      <SuccessCard
        submittedId={submittedId}
        copied={copied}
        onCopy={handleCopy}
        onTrack={() => navigate("/track")}
        onSubmitAgain={() => setSubmittedId(null)}
      />
    );
  }

  // ─── Form screen ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Page Header */}

        <PageHeader
          title="Submit Issue Request"
          description="Fill out the form below to request equipment or inventory. All
            requests are tracked for quality assurance and compliance."
        />

        {/* Form card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="rounded-lg border border-gray-200 bg-white p-8 shadow-lg"
        >
          {/* Row: Department + Name */}
          <div className="mb-5 grid grid-cols-2 gap-5">
            {/* Department */}
            <FormField
              name="department"
              register={register}
              label="Department"
              error={errors.department}
              options={DEPARTMENTS}
              selectOption="select"
              placeholder="Select a department"
              required
              rules={{
                required: "Department is required",
              }}
            />

            <FormField
              name="fullname"
              register={register}
              label="Full Name"
              placeholder="e.g. Alexander Pierce"
              error={errors.fullname}
              required
              rules={{
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Name is too short",
                },
              }}
            />
          </div>

          {/* Email */}

          <FormField
            name="email"
            type="email"
            placeholder="example@rotocastgroup.com"
            required
            label="Email"
            register={register}
            error={errors.email}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            }}
          />

          {/* Item search */}
          <div className="mt-5 mb-5">
            <ItemSearchAdd
              onAdd={handleAddItem}
              alreadyAddedIds={fields.map((f) => f.productId)}
            />
            {itemsError && <p style={errorStyle}>{itemsError}</p>}
          </div>

          {/* Selected items table */}
          {fields.length > 0 && (
            <div className="border border-outline-variant rounded-md overflow-hidden mb-5">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_120px_32px] gap-3 px-4 py-2.5 bg-surface-container-low border-b border-outline-variant">
                <span className="text-md font-md uppercase tracking-normal text-on-surface-variant">
                  Selected Items
                </span>

                <span className="text-md font-medium uppercase tracking-letter-spacing text-on-surface-variant text-right">
                  Quantity
                </span>

                <span />
              </div>

              {/* Rows */}
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={`grid grid-cols-[1fr_120px_32px] gap-3 items-center px-4 py-3 ${
                    index < fields.length - 1
                      ? "border-b border-outline-variant"
                      : ""
                  }`}
                >
                  {/* Item info */}
                  <div>
                    <p className="text-sm font-medium text-on-surface">
                      {field.productName}
                    </p>

                    <p className="text-sm font-medium text-gray-400">
                      {field.category}
                    </p>
                  </div>

                  {/* Quantity input */}
                  <div className="flex flex-col items-end gap-1">
                    <FormField
                      type="number"
                      name={`items.${index}.qty`}
                      register={register}
                      rules={{
                        required: "Required",
                        min: {
                          value: 0.01,
                          message: "Min 0.01",
                        },
                        valueAsNumber: true,
                      }}
                      error={errors?.items?.[index]?.qty}
                    />
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="flex items-center justify-center bg-transparent border-0 cursor-pointer text-on-surface-variant rounded-sm p-1 transition-colors duration-150 hover:text-error"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <FormField
            selectOption="textarea"
            label="Description"
            name="description"
            placeholder="Please provide a detailed justification for this inventory request..."
            register={register}
            error={errors.description}
            required
            rows={4}
            rules={{
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters",
              },
            }}
          />

          {/* Divider + Submit */}
          <div className="flex justify-end border-t border-gray-400 pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 rounded-lg px-7 py-3 text-sm font-medium text-white transition${
                loading
                  ? "cursor-not-allowed bg-gray-400"
                  : "cursor-pointer bg-on-primary-fixed-variant hover:bg-on-primary-fixed"
              }`}
            >
              {loading ? "Submitting..." : "Submit Request"}

              {!loading && <Send size={16} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
