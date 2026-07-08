import { CheckCircle2, Check, Copy, Search } from "lucide-react";

const SuccessCard = ({
  submittedId,
  copied,
  onCopy,
  onTrack,
  onSubmitAgain,
}) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-130 bg-surface-container-lowest border border-outline-variant rounded-lg px-10 py-12 text-center shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-secondary-fixed flex items-center justify-center mx-auto">
          <CheckCircle2 size={32} className="text-secondary" />
        </div>

        {/* Title */}
        <h1
          className="mt-6 text-md font-medium leading-line-height
          tracking-letter-spacing text-on-surface"
        >
          Thank you for your submission!
        </h1>

        {/* Description */}
        <p
          className="
          mt-2 mx-auto max-w-95
          text-md text-on-surface-variant "
        >
          Your request has been received and will be reviewed for approval. Use
          the Request ID below to track its status at any time.
        </p>

        {/* Request ID */}
        <div className="max-w-80 mx-auto mt-8 text-left">
          <p className="mb-1 text-sm font-medium text-on-surface-variant">
            Your Request ID
          </p>

          <div
            className="
            flex items-center justify-between gap-3
            bg-surface-container-low
            border border-outline-variant
            rounded-md px-4 py-3
          "
          >
            <span
              className="
              text-lg font-semibold tracking-wider
              text-primary-container
            "
            >
              {submittedId}
            </span>

            <button
              type="button"
              onClick={onCopy}
              className="
                flex items-center gap-1.5
                text-sm font-semibold
                text-primary-container
                bg-transparent
                cursor-pointer
                px-2 py-1 rounded-sm
              "
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}

              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onTrack}
            className="
              flex items-center gap-2
              bg-primary-container text-white
              rounded-md px-6 py-3
              text-sm font-medium
              cursor-pointer
            "
          >
            <Search size={16} />
            Track Status
          </button>

          <button
            type="button"
            onClick={onSubmitAgain}
            className="
              bg-surface-container-lowest
              text-primary-container
              border border-outline-variant
              rounded-md px-6 py-3
              text-sm font-medium
              cursor-pointer
            "
          >
            Submit Another Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessCard;
