// src/pages/PaymentSuccess.jsx
import { useNavigate, useLocation } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const status = params.get("status");

  if (status !== "ok") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-red-400">Invalid access</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-10">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-green-400 mb-3">
          Payment Successful!
        </h1>
        <p className="text-slate-300">
          Your transaction was completed.
        </p>
        <p className="text-slate-300 mt-2">
          Your ticket information has been sent to your email.
        </p>

        <button
          onClick={() => navigate("/schedules")}
          className="mt-8 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium px-6 py-3 hover:opacity-90"
        >
          Back to Schedules
        </button>
      </div>
    </div>
  );
}
