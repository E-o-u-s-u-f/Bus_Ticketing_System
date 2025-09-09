// src/pages/RouteCreate.jsx
import { useState, useEffect } from "react";

export default function RouteCreate() {
  const [routes, setRoutes] = useState([]);
  const [formData, setFormData] = useState({
    fromLocation: "",
    toLocation: "",
  });
  const [msg, setMsg] = useState("");

  // Load all routes on mount
  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/routes");
      const data = await res.json();
      if (data.success) {
        setRoutes(data.data);
      }
    } catch (err) {
      console.error("Error fetching routes:", err);
      setMsg("❌ Failed to load routes.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    const exists = routes.some((r) => {
      const from = r.fromLocation || r.fromlocation;
      const to = r.toLocation || r.tolocation;
      return (
        from?.toLowerCase() === formData.fromLocation.toLowerCase() &&
        to?.toLowerCase() === formData.toLocation.toLowerCase()
      );
    });

    if (exists) {
      setMsg("❌ This route already exists.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromlocation: formData.fromLocation,
          tolocation: formData.toLocation,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setMsg("✅ Route created successfully!");
        fetchRoutes();
        setFormData({ fromLocation: "", toLocation: "" });
      } else {
        setMsg("❌ Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      setMsg("❌ Error creating route.");
    }
  };

  const card = "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl";
  const input = "mt-1 w-full rounded-xl bg-white/5 text-white placeholder-slate-400 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/50";
  const label = "text-slate-200 text-sm";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black p-4 sm:p-8">
              <div className="max-w-7xl mx-auto mb-6 flex flex-wrap gap-3">
        {[
          { label: "Schedules", link: "/admin/schedules" },
          { label: "Routes", link: "/admin/route" },
          { label: "Buses", link: "/admin/bus" }
        ].map((btn) => (
          <a
            key={btn.label}
            href={btn.link}
            className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition duration-200"
          >
            {btn.label}
          </a>
        ))}
      </div>
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className={`${card} p-6 lg:col-span-1`}>
          <h2 className="text-white text-lg font-medium mb-4">Create Route</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className={label}>From Location</span>
              <input
                type="text"
                name="fromLocation"
                placeholder="From Location"
                value={formData.fromLocation}
                onChange={handleChange}
                className={input}
                required
              />
            </label>
            <label className="block">
              <span className={label}>To Location</span>
              <input
                type="text"
                name="toLocation"
                placeholder="To Location"
                value={formData.toLocation}
                onChange={handleChange}
                className={input}
                required
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium px-5 py-2"
            >
              Add Route
            </button>

            {msg && (
              <div className={`text-sm mt-3 p-2 rounded ${/✅/.test(msg) ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700"}`}>
                {msg}
              </div>
            )}
          </form>
        </div>

        {/* Routes Table */}
        <div className={`${card} p-6 lg:col-span-2`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-medium">Existing Routes</h2>
            <button onClick={fetchRoutes} className="rounded-xl bg-white/10 text-slate-200 px-3 py-2">Reload</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-slate-300 text-sm border-b border-white/10">
                  <th className="py-2 pr-4">#</th>
                  <th className="py-2 pr-4">From</th>
                  <th className="py-2 pr-4">To</th>
                </tr>
              </thead>
              <tbody className="text-slate-100/90">
                {routes.length ? (
                  routes.map((r, idx) => {
                    const from = r.fromLocation || r.fromlocation;
                    const to = r.toLocation || r.tolocation;
                    return (
                      <tr key={r.id || `${from}-${to}-${idx}`} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-2 pr-4 font-mono">{idx + 1}</td>
                        <td className="py-2 pr-4">{from}</td>
                        <td className="py-2 pr-4">{to}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="py-4 text-slate-400">No routes yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
