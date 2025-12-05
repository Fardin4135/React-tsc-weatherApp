import { RefreshCw } from "lucide-react";

interface ApiErrorProps {
  onRetry?: () => void;
}

const ApiError: React.FC<ApiErrorProps> = ({ onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center my-6 md:my-10 lg:my-12">
      
      {/* Icon */}
      <div className="mb-4 text-gray-300 text-4xl">
        ⃠
      </div>

      {/* Title */}
      <h1 className="text-white text-3xl md:text-4xl font-semibold mb-3">
        Something went wrong
      </h1>

      {/* Description */}
      <p className="text-gray-300 max-w-md mb-6 text-sm md:text-base">
        We couldn’t connect to the server (API error). Please try again in a few moments.
      </p>

      {/* Retry Button */}
      <button
        onClick={onRetry}
        className="flex items-center gap-2 bg-[hsl(243,23%,30%)] hover:bg-[hsl(243,23%,35%)] text-white px-5 py-2 rounded-md transition cursor-pointer"
      >
        <RefreshCw size={16} />
        Retry
      </button>
    </div>
  );
};

export default ApiError;
