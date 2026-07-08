import { ChevronDown } from "lucide-react";

const FormField = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  rules,
  error,
  required = false,
  selectOption = "input",
  options = [],
  rows = 4,
}) => {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-600">
          {label}

          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      {/* Select */}
      {selectOption === "select" ? (
        <div className="relative">
          <select
            {...register(name, rules)}
            className="w-full cursor-pointer appearance-none rounded-lg
              border border-gray-300 bg-white px-3 py-2.5 pr-9 text-sm text-gray-900
              outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 "
          >
            <option value="">{placeholder}</option>

            {options.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      ) : selectOption === "textarea" ? (
        /* Textarea */
        <textarea
          rows={rows}
          placeholder={placeholder}
          {...register(name, rules)}
          className="w-full min-h-28 resize-y rounded-lg border border-gray-300 bg-white px-3
            py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500
            focus:ring-2 focus:ring-blue-100"
        />
      ) : (
        /* Input */
        <input
          type={type}
          placeholder={placeholder}
          {...register(name, rules)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5
            text-sm text-gray-900 outline-none transition
            focus:border-blue-500 focus:ring-2
            focus:ring-blue-100"
        />
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default FormField;
