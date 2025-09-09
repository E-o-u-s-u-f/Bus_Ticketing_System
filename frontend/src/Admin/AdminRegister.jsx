// src/pages/AdminRegister.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminRegister() {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [adminid, setAdminid] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  setMsg(null);
  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/api/admin/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        adminid,
        fullname,
        email,
        PassKey: password, // 👈 map password → PassKey
      }),
    });

    const data = await res.json();
    if (!res.ok || !data?.success) {
      throw new Error(data?.message || "Registration failed");
    }

    setMsg("Admin account created! Redirecting…");
    setTimeout(() => navigate("/admin/login"), 500);
  } catch (err) {
    setMsg(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black flex items-center justify-center p-4">
      {/* Glow Orbs */}
      <div className="pointer-events-none absolute -z-10 blur-3xl opacity-30">
        <div className="w-72 h-72 rounded-full bg-purple-600/40 absolute -top-10 -left-10" />
        <div className="w-72 h-72 rounded-full bg-pink-500/40 absolute bottom-0 right-0" />
      </div>

      {/* Glass Card */}
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 grid place-items-center text-white font-semibold">
              A
            </div>
            <div >
              <h1 className="text-white text-xl font-semibold">Admin Register</h1>
              <p className="text-slate-300/80 text-sm">Create a new admin account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-slate-200 text-sm">Admin ID</span>
              <input
                type="text"
                required
                value={adminid}
                onChange={(e) => setAdminid(e.target.value)}
                className="mt-1 w-full rounded-xl bg-white/5 text-white placeholder-slate-400 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400/50"
              />
            </label>
            <label className="block">
              <span className="text-slate-200 text-sm">Transport Name</span>
              <input
                type="text"
                required
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="mt-1 w-full rounded-xl bg-white/5 text-white placeholder-slate-400 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400/50"
                placeholder="Sofia Akter"
              />
            </label>

            <label className="block">
              <span className="text-slate-200 text-sm">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl bg-white/5 text-white placeholder-slate-400 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400/50"
                placeholder="admin@example.com"
              />
            </label>

            <label className="block">
              <span className="text-slate-200 text-sm">Password</span>
              <div className="mt-1 relative">
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl bg-white/5 text-white placeholder-slate-400 border border-white/10 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-pink-400/50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute inset-y-0 right-2 my-auto h-9 px-3 rounded-lg bg-white/5 text-slate-200 hover:bg-white/10 transition"
                >
                  {showPwd ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-3 hover:opacity-95 active:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Registering…" : "Register"}
            </button>
          </form>

          {msg && (
            <div
              className={`mt-4 text-sm ${
                msg.toLowerCase().includes("created")
                  ? "text-emerald-300"
                  : "text-rose-300"
              }`}
            >
              {msg}
            </div>
          )}

          <div className="mt-6 text-center text-slate-400 text-sm">
            Already have an account?{" "}
            <a
              href="/admin/login"
              className="text-pink-300 hover:text-pink-200 underline underline-offset-4"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
