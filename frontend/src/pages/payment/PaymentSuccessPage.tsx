import { useSearchParams } from "react-router-dom";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference"); // Extract transaction reference

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
      <p className="text-lg text-gray-800">Thank you for your purchase.</p>
      <p className="mt-4 text-gray-600">
        Your transaction reference: <strong>{reference}</strong>
      </p>
      <button
        onClick={() => window.location.href = "/"}
        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded"
      >
        Back to Home
      </button>
    </div>
  );
};

export default SuccessPage;
