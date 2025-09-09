// src/pages/AdminScheduleManager.jsx
import React, { useEffect, useMemo, useState } from "react";

export default function AdminScheduleManager() {
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  // Form state
  const [mode, setMode] = useState("create");
  const [scheid, setScheid] = useState("");
  const [routesid, setRoutesid] = useState("");
  const [busid, setBusid] = useState("");
  const [fare, setFare] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const dtimeFromParts = () => {
    if (!date || !time) return null;
    return `${date} ${time}:00`;
  };

  const reset = () => {
    setMode("create");
    setScheid("");
    setRoutesid("");
    setBusid("");
    setFare("");
    setDate("");
    setTime("");
  };

  // Load routes, buses, schedules
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [rRes, bRes, sRes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/routes"),
          fetch("http://localhost:5000/api/admin/bus?status=active"),
          fetch("http://localhost:5000/api/admin/schedule"),
        ]);

        const rData = await rRes.json();
        const bData = await bRes.json();
        const sData = await sRes.json();

        setRoutes(rData.success ? rData.data : []);
        setBuses(bData.success ? bData.data : []);
        setSchedules(sData.success ? sData.data : []);
      } catch (e) {
        setMsg(e.message || "Load failed");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const routeById = useMemo(() => {
    const m = new Map();
    routes.forEach((r) => m.set(r.rid, r));
    return m;
  }, [routes]);

  const busById = useMemo(() => {
    const m = new Map();
    buses.forEach((b) => m.set(b.busid, b));
    return m;
  }, [buses]);

  const onEdit = (row) => {
    setMode("edit");
    setScheid(row.scheid);
    setRoutesid(String(row.routesid));
    setBusid(String(row.busid));
    setFare(row.fare);
    const dt = new Date(row.dtime);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const d = String(dt.getDate()).padStart(2, "0");
    const hh = String(dt.getHours()).padStart(2, "0");
    const mm = String(dt.getMinutes()).padStart(2, "0");
    setDate(`${y}-${m}-${d}`);
    setTime(`${hh}:${mm}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const refreshSchedules = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/schedule");
      const data = await res.json();
      setSchedules(data?.data || []);
    } catch (e) {
      setMsg(e.message || "Failed to refresh schedules");
    }
  };

  const createSchedule = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!routesid || !busid || !fare || !date || !time) {
      setMsg("Fill all fields.");
      return;
    }

    const dtime = dtimeFromParts();

    try {
      const res = await fetch("http://localhost:5000/api/admin/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dtime,
          routesid: Number(routesid),
          busid: Number(busid),
          fare: Number(fare),
        }),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) throw new Error(data?.message || "Create failed");

      setMsg("✅ Schedule created.");
      await refreshSchedules();
      reset();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const updateSchedule = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (!scheid) {
      setMsg("Pick a schedule to edit.");
      return;
    }

    const dtime = dtimeFromParts();

    try {
      const res = await fetch(`http://localhost:5000/api/admin/schedule/${scheid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dtime,
          routesid: Number(routesid),
          busid: Number(busid),
          fare: Number(fare),
        }),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false) throw new Error(data?.message || "Update failed");

      setMsg("✳️ Schedule updated.");
      await refreshSchedules();
      reset();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const deleteSchedule = async (id) => {
    if (!confirm(`Delete schedule #${id}?`)) return;
    setMsg(null);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/schedule/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || data?.success === false) throw new Error(data?.message || "Delete failed");

      setMsg(`🗑️ Deleted #${id}.`);
      await refreshSchedules();
      if (String(id) === String(scheid)) reset();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const card = "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl";
  const input = "mt-1 w-full rounded-xl bg-white/5 text-white placeholder-slate-400 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/50";
  const label = "text-slate-200 text-sm";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black p-4 sm:p-8">
      
      {/* Top Hover Buttons */}
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
            {mode === "create" ? "Create Schedule" : `Edit #${scheid}`}
          </h2>
          <form onSubmit={mode === "create" ? createSchedule : updateSchedule} className="space-y-4">
            <label className="block">
              <span className={label}>Route</span>
              <select className={input} value={routesid} onChange={(e)=>setRoutesid(e.target.value)} required>
                <option className="text-black" value="">Select a route</option>
                {routes.map(r => <option className="text-black" key={r.rid} value={r.rid}>{r.fromlocation} → {r.tolocation}</option>)}
              </select>
            </label>

            <label className="block">
              <span className={label}>Bus</span>
              <select className={input} value={busid} onChange={(e)=>setBusid(e.target.value)} required>
                <option className="text-black" value="">Select a bus</option>
                {buses.map(b => <option className="text-black" key={b.busid} value={b.busid}>{b.busnumber} • {b.bustype} ({b.company})</option>)}
              </select>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className={label}>Date</span>
                <input className={input} type="date" value={date} onChange={(e)=>setDate(e.target.value)} required />
              </label>
              <label className="block">
                <span className={label}>Time</span>
                <input className={input} type="time" step="60" value={time} onChange={(e)=>setTime(e.target.value)} required />
              </label>
            </div>

            <label className="block">
              <span className={label}>Fare</span>
              <input className={input} type="number" step="0.01" value={fare} onChange={(e)=>setFare(e.target.value)} required />
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
            <h2 className="text-white text-lg font-medium">Schedules</h2>
            <button onClick={refreshSchedules} className="rounded-xl bg-white/10 text-slate-200 px-3 py-2">Reload</button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-slate-300 text-sm border-b border-white/10">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Datetime</th>
                  <th className="py-2 pr-4">Route</th>
                  <th className="py-2 pr-4">Bus</th>
                  <th className="py-2 pr-4">Fare</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-100/90">
                {loading ? (
                  <tr><td className="py-4" colSpan={6}>Loading…</td></tr>
                ) : schedules.length ? (
                  schedules.map(row => {
                    const rt = routeById.get(row.routesid);
                    const bs = busById.get(row.busid);
                    const when = new Date(row.dtime).toLocaleString();
                    return (
                      <tr key={row.scheid} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-2 pr-4 font-mono">{row.scheid}</td>
                        <td className="py-2 pr-4">{when}</td>
                        <td className="py-2 pr-4">{rt ? `${rt.fromlocation} → ${rt.tolocation}` : `#${row.routesid}`}</td>
                        <td className="py-2 pr-4">{bs ? `${bs.busnumber} • ${bs.bustype}` : `#${row.busid}`}</td>
                        <td className="py-2 pr-4">{Number(row.fare).toFixed(2)}</td>
                        <td className="py-2 pr-4">
                          <div className="flex gap-2">
                            <button onClick={() => onEdit(row)} className="rounded-lg bg-white/10 px-3 py-1.5">Edit</button>
                            <button onClick={() => deleteSchedule(row.scheid)} className="rounded-lg bg-rose-600/80 text-white px-3 py-1.5">Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td className="py-4 text-slate-400" colSpan={6}>No schedules yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
