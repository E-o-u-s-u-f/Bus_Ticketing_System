import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [passKey, setPassKey] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          PassKey: passKey
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Login failed");
      }

      setMsg("Login successful!");
      // optionally store user in localStorage/session
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      navigate("/admin/schedules"); // redirect to admin dashboard
    } catch (err) {
      setMsg(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 grid place-items-center text-white font-semibold">A</div>
            <div>
              <h1 className="text-white text-xl font-semibold">Admin Panel</h1>
              <p className="text-slate-300/80 text-sm">Sign in to manage schedules</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-slate-200 text-sm">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl bg-white/5 text-white placeholder-slate-400 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/50"
                placeholder="Email"
              />
            </label>

            <label className="block">
              <span className="text-slate-200 text-sm">PassKey</span>
              <div className="mt-1 relative">
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  value={passKey}
                  onChange={(e) => setPassKey(e.target.value)}
                  className="w-full rounded-xl bg-white/5 text-white placeholder-slate-400 border border-white/10 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-cyan-400/50"
                  placeholder="PassKey"
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
              className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium py-3 hover:opacity-95 active:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          {msg && (
            <div className={`mt-4 text-sm ${msg.toLowerCase().includes("success") ? "text-emerald-300" : "text-rose-300"}`}>
              {msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
