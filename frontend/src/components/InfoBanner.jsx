import { Info } from "lucide-react";

const InfoBanner = ({ title, message, icon = true }) => {
  return (
    <div className="mb-7 flex gap-3 rounded-lg bg-blue-50 px-4 py-3.5">
      {icon && <Info size={18} className="mt-0.5 shrink-0 text-blue-700" />}

      <p className="text-sm text-blue-700">
        {title && <span className="font-semibold">{title}. </span>}

        {message}
      </p>
    </div>
  );
};

export default InfoBanner;
