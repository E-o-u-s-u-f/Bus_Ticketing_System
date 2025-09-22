// src/pages/AdminDriver.jsx
import React, { useEffect, useState } from "react";

export default function AdminDriver() {
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  // Form state
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [licensenum, setLicensenum] = useState("");
  const [assignedbusid, setAssignedbusid] = useState("");

  // Load drivers
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/drivers");
      if (!res.ok) throw new Error("Failed to load drivers");
      const data = await res.json();
      setDrivers(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setMsg(err.message || "Failed to load drivers");
    } finally {
      setLoading(false);
    }
  };

  // Load buses
  const fetchBuses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/bus");
      const data = await res.json();
      setBuses(data.success ? data.data : []);
    } catch (err) {
      console.error("Error loading buses", err);
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchBuses();
  }, []);

  const reset = () => {
    setFullname("");
    setPhone("");
    setLicensenum("");
    setAssignedbusid("");
    setMsg(null);
  };

  // Create a new driver
  const createDriver = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (!fullname || !licensenum) {
      setMsg("Fullname and license number are required.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, phone, licensenum, assignedbusid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed");
      setMsg("✅ " + data.message);
      reset();
      await fetchDrivers();
    } catch (err) {
      setMsg(err.message);
    }
  };

  // Delete driver
  const deleteDriver = async (id) => {
    if (!confirm(`Delete driver #${id}?`)) return;
    setMsg(null);
    try {
      const res = await fetch(`http://localhost:5000/api/drivers/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Delete failed");
      setMsg("🗑️ " + data.message);
      await fetchDrivers();
    } catch (err) {
      setMsg(err.message);
    }
  };

  // Update bus assignment for existing driver
  const updateBusAssignment = async (driverid, busid) => {
    setMsg(null);
    try {
      const res = await fetch(
        `http://localhost:5000/api/drivers/${driverid}/assign-bus`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ busid }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Update failed");
      setMsg("✅ Bus assignment updated");
      await fetchDrivers();
    } catch (err) {
      setMsg(err.message);
    }
  };

  // Styles
  const card =
    "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl";
  const input =
    "mt-1 w-full rounded-xl bg-white/10 text-white placeholder-slate-400 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/50";
  const label = "text-slate-200 text-sm";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black p-4 sm:p-8">
      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap gap-3">
        {[
          { label: "Schedules", link: "/admin/schedules" },
          { label: "Routes", link: "/admin/route" },
          { label: "Buses", link: "/admin/bus" },
          { label: "Drivers", link: "/admin/drivers" },
        ].map((btn) => (
          <a
            key={btn.label}
            href={btn.link}
            className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition duration-200"
          >
            {btn.label}
          </a>
        ))}
        <a
          href="/Home"
          className="ml-auto px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition duration-200"
        >
          ⬅️ Return Home
        </a>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Driver Form */}
        <div className={`${card} p-6`}>
          <h2 className="text-white text-lg font-medium mb-4">Add Driver</h2>
          <form onSubmit={createDriver} className="space-y-4">
            <label className="block">
              <span className={label}>Full Name</span>
              <input
                className={input}
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </label>
            <label className="block">
              <span className={label}>Phone</span>
              <input
                className={input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <label className="block">
              <span className={label}>License Number</span>
              <input
                className={input}
                value={licensenum}
                onChange={(e) => setLicensenum(e.target.value)}
                required
              />
            </label>
            <label className="block">
              <span className={label}>Assigned Bus</span>
              <select
                className={input}
                value={assignedbusid}
                onChange={(e) => setAssignedbusid(e.target.value)}
              >
                <option value="">-- None --</option>
                {buses.map((b) => (
                  <option key={b.busid} value={b.busid} className="text-black">
                    {b.busnumber} ({b.company})
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium px-5 py-2"
            >
              Add Driver
            </button>
            {msg && (
              <div
                className={`text-sm mt-3 ${
                  /✅|🗑️/.test(msg) ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {msg}
              </div>
            )}
          </form>
        </div>

        {/* Drivers Table */}
        <div className={`${card} lg:col-span-2 overflow-x-auto`}>
          <h2 className="text-white text-lg font-medium p-4">Drivers List</h2>
          {loading ? (
            <p className="text-slate-400 p-4">Loading...</p>
          ) : (
            <table className="min-w-full text-sm text-left text-slate-300">
              <thead>
                <tr className="bg-white/10 text-slate-200">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Full Name</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">License</th>
                  <th className="px-4 py-2">Bus</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((d) => (
                  <tr key={d.driverid} className="hover:bg-white/5">
                    <td className="px-4 py-2">{d.driverid}</td>
                    <td className="px-4 py-2">{d.fullname}</td>
                    <td className="px-4 py-2">{d.phone}</td>
                    <td className="px-4 py-2">{d.licensenum}</td>
                    <td className="px-4 py-2">
                      <select
                        value={d.assignedbusid || ""}
                        onChange={(e) =>
                          updateBusAssignment(d.driverid, e.target.value)
                        }
                        className="rounded-xl bg-white/10 text-white px-2 py-1 w-full focus:ring-2 focus:ring-cyan-400/50"
                      >
                        <option value="">-- None --</option>
                        {buses.map((b) => (
                          <option
                            key={b.busid}
                            value={b.busid}
                            className="text-black"
                          >
                            {b.busnumber} ({b.company})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => deleteDriver(d.driverid)}
                        className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
