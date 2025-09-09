// src/pages/BusManager.jsx
import React, { useEffect, useState } from "react";

export default function BusManager() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  // form state
  const [mode, setMode] = useState("create");
  const [busid, setBusid] = useState("");
  const [busnumber, setBusnumber] = useState("");
  const [bustype, setBustype] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("active");

  const reset = () => {
    setMode("create");
    setBusid("");
    setBusnumber("");
    setBustype("");
    setCompany("");
    setStatus("active");
  };

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/admin/bus");
      const data = await res.json();
      setBuses(data.success ? data.data : []);
    } catch (e) {
      setMsg(e.message || "Failed to load buses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const onEdit = (bus) => {
    setMode("edit");
    setBusid(bus.busid);
    setBusnumber(bus.busnumber);
    setBustype(bus.bustype);
    setCompany(bus.company);
    setStatus(bus.status);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const createBus = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!busnumber || !bustype || !company || !status) {
      setMsg("Fill all fields.");
      return;
    }

    // Duplicate bus number check
    const duplicate = buses.find(b => b.busnumber.toLowerCase() === busnumber.toLowerCase());
    if (duplicate) {
      setMsg(`Bus number "${busnumber}" already exists.`);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/bus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ busnumber, bustype, company, status }),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) throw new Error(data?.message || "Create failed");

      setMsg("✅ Bus created.");
      await fetchBuses();
      reset();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const updateBus = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!busid) { setMsg("Pick a bus to edit."); return; }
    if (!busnumber || !bustype || !company || !status) {
      setMsg("Fill all fields.");
      return;
    }

    // Duplicate check for other buses
    const duplicate = buses.find(b => b.busnumber.toLowerCase() === busnumber.toLowerCase() && b.busid !== busid);
    if (duplicate) {
      setMsg(`Bus number "${busnumber}" already exists.`);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/admin/bus/${busid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ busnumber, bustype, company, status }),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) throw new Error(data?.message || "Update failed");

      setMsg("✳️ Bus updated.");
      await fetchBuses();
      reset();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const deleteBus = async (id) => {
    if (!confirm(`Delete bus #${id}?`)) return;
    setMsg(null);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/bus/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || data?.success === false) throw new Error(data?.message || "Delete failed");

      setMsg(`🗑️ Deleted #${id}.`);
      await fetchBuses();
      if (String(id) === String(busid)) reset();
    } catch (err) {
      setMsg(err.message);
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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className={`${card} p-6`}>
          <h2 className="text-white text-lg font-medium mb-4">
            {mode === "create" ? "Create Bus" : `Edit #${busid}`}
          </h2>
          <form onSubmit={mode === "create" ? createBus : updateBus} className="space-y-4">
            <label className="block">
              <span className={label}>Bus Number</span>
              <input className={input} value={busnumber} onChange={e => setBusnumber(e.target.value)} required />
            </label>
            <label className="block">
              <span className={label}>Bus Type</span>
              <input className={input} value={bustype} onChange={e => setBustype(e.target.value)} required />
            </label>
            <label className="block">
              <span className={label}>Company</span>
              <input className={input} value={company} onChange={e => setCompany(e.target.value)} required />
            </label>
            <label className="block">
              <span className={label}>Status</span>
              <select className={input} value={status} onChange={e => setStatus(e.target.value)} required>
                <option className="text-black" value="Active">Active</option>
                <option className="text-black" value="Inactive">Inactive</option>
                <option className="text-black" value="Maintenance">Maintenance</option>
              </select>
            </label>

            <div className="flex gap-3">
              <button type="submit" className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium px-5 py-2">
                {mode === "create" ? "Create" : "Save"}
              </button>
              {mode === "edit" && (
                <button type="button" onClick={reset} className="rounded-xl bg-white/10 text-slate-200 px-4 py-2">Cancel</button>
              )}
            </div>

            {msg && <div className={`text-sm mt-3 ${/✅|✳️|🗑️/.test(msg) ? "text-emerald-300" : "text-rose-300"}`}>{msg}</div>}
          </form>
        </div>

        {/* Table */}
        <div className={`${card} p-6 lg:col-span-2`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-medium">Buses</h2>
            <button onClick={fetchBuses} className="rounded-xl bg-white/10 text-slate-200 px-3 py-2">Reload</button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-slate-300 text-sm border-b border-white/10">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Bus Number</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Company</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-100/90">
                {loading ? (
                  <tr><td className="py-4" colSpan={6}>Loading…</td></tr>
                ) : buses.length ? (
                  buses.map(bus => (
                    <tr key={bus.busid} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-2 pr-4 font-mono">{bus.busid}</td>
                      <td className="py-2 pr-4">{bus.busnumber}</td>
                      <td className="py-2 pr-4">{bus.bustype}</td>
                      <td className="py-2 pr-4">{bus.company}</td>
                      <td className="py-2 pr-4">{bus.status}</td>
                      <td className="py-2 pr-4">
                        <div className="flex gap-2">
                          <button onClick={() => onEdit(bus)} className="rounded-lg bg-white/10 px-3 py-1.5">Edit</button>
                          <button onClick={() => deleteBus(bus.busid)} className="rounded-lg bg-rose-600/80 text-white px-3 py-1.5">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td className="py-4 text-slate-400" colSpan={6}>No buses yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
