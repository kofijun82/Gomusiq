import { useSearchParams } from "react-router-dom";

const FailurePage = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100">
      <h1 className="text-3xl font-bold text-red-600">Payment Failed</h1>
      <p className="text-lg text-gray-800">Unfortunately, your payment could not be processed.</p>
      <p className="mt-4 text-gray-600">
        Transaction reference: <strong>{reference || "N/A"}</strong>
      </p>
      <button
        onClick={() => window.location.href = "/"}
        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded"
      >
        Try Again
      </button>
    </div>
  );
};

export default FailurePage;
