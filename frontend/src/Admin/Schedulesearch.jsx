// src/pages/ScheduleSearch.jsx
import React, { useEffect, useState, useMemo } from "react";

export default function ScheduleSearch() {
  const [allSchedules, setAllSchedules] = useState([]); // full data
  const [schedules, setSchedules] = useState([]);       // filtered data
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // Form state
  const [fromLoc, setFromLoc] = useState("");
  const [toLoc, setToLoc] = useState("");
  const [date, setDate] = useState(""); // yyyy-mm-dd
  const [upcomingOnly, setUpcomingOnly] = useState(true);

  // Load schedules
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/schedules"); // only schedules
        const data = await res.json();
        setAllSchedules(data?.data || []);
        setSchedules(data?.data || []);
      } catch (err) {
        setMsg(err.message || "Failed to load schedules");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // From options
  const fromOptions = useMemo(() => {
    const seen = new Set();
    return allSchedules
      .map((s) => s.fromlocation)
      .filter((f) => {
        if (seen.has(f)) return false;
        seen.add(f);
        return true;
      })
      .sort();
  }, [allSchedules]);

  // To options depends on selected From
  const toOptions = useMemo(() => {
    if (!fromLoc) return [];
    const seen = new Set();
    return allSchedules
      .filter((s) => s.fromlocation.toLowerCase() === fromLoc.toLowerCase())
      .map((s) => s.tolocation)
      .filter((t) => {
        if (seen.has(t)) return false;
        seen.add(t);
        return true;
      })
      .sort();
  }, [allSchedules, fromLoc]);

  const sameDate = (iso, yyyy_mm_dd) => {
    try {
      const d = new Date(iso);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const da = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${da}` === yyyy_mm_dd;
    } catch {
      return false;
    }
  };

  // Search handler: only works if all 3 fields are filled
  const handleSearch = (e) => {
    e.preventDefault();
    setMsg(null);

    if (!fromLoc || !toLoc || !date) {
      setMsg("To use filter, please select From, To, and Date.");
      return;
    }

    setLoading(true);
    try {
      let filtered = allSchedules.filter(
        (row) =>
          row.fromlocation.toLowerCase() === fromLoc.toLowerCase() &&
          row.tolocation.toLowerCase() === toLoc.toLowerCase() &&
          sameDate(row.dtime, date)
      );

      if (upcomingOnly) {
        const now = new Date();
        filtered = filtered.filter((row) => new Date(row.dtime) >= now);
      }

      setSchedules(filtered);
      if (filtered.length === 0) setMsg("No schedules found for your selection.");
    } catch (err) {
      setMsg(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setFromLoc("");
    setToLoc("");
    setDate("");
    setMsg(null);
    setSchedules(allSchedules); // restore all schedules
  };

  const card = "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl";
  const input =
    "mt-1 w-full rounded-xl bg-white text-black placeholder-slate-400 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/50";
  const label = "text-slate-200 text-sm";

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-white text-2xl sm:text-3xl font-semibold">Find a Schedule</h1>
          <p className="text-slate-300/80 mt-1">Search by route and date.</p>
        </div>

        {/* Search Form */}
        <div className={`${card} p-6 mb-6`}>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <label className="block">
              <span className={label}>From</span>
              <select className={input} value={fromLoc} onChange={(e) => { setFromLoc(e.target.value); setToLoc(""); }} required>
                <option value="">Select</option>
                {fromOptions.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </label>

            <label className="block">
              <span className={label}>To</span>
              <select className={input} value={toLoc} onChange={(e) => setToLoc(e.target.value)} required disabled={!fromLoc}>
                <option value="">{fromLoc ? "Select" : "Choose From first"}</option>
                {toOptions.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>

            <label className="block">
              <span className={label}>Date</span>
              <input type="date" className={input} value={date} onChange={(e) => setDate(e.target.value)} required />
            </label>

            <div className="md:col-span-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-2">
              <label className="inline-flex items-center gap-2 text-slate-300">
                <input type="checkbox" className="accent-cyan-400 h-4 w-4" checked={upcomingOnly} onChange={(e) => setUpcomingOnly(e.target.checked)} />
                Upcoming only
              </label>
              <div className="ml-auto flex gap-3">
                <button type="button" onClick={clearSearch} className="rounded-xl bg-white/10 text-slate-200 px-4 py-2 hover:bg-white/15">Clear</button>
                <button type="submit" className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium px-5 py-2.5 hover:opacity-95 active:opacity-90">Search</button>
              </div>
            </div>
          </form>
          {msg && <div className={`mt-4 text-sm ${msg.includes("No schedules") ? "text-amber-300" : "text-rose-300"}`}>{msg}</div>}
        </div>

        {/* Results */}
        <div className="space-y-3">
          {loading ? (
            <div className={`${card} p-6 text-slate-300`}>Loading schedules…</div>
          ) : schedules.length ? (
            schedules.map((row) => {
              const dt = new Date(row.dtime);
              return (
                <div key={`${row.scheid}-${row.dtime}`} className={`${card} p-5`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-white text-lg font-medium">{row.fromlocation} → {row.tolocation}</div>
                      <div className="text-slate-300/90 text-sm">
                        {dt.toLocaleString()} • Bus: {row.busnumber} ({row.bustype})
                        {row.drivername ? ` • Driver: ${row.drivername}` : ""}
                      </div>
                    </div>
                    <div className="text-white text-right">
                      <div className="text-xl font-semibold">{Number(row.fare).toFixed(2)}</div>
                      <div className="text-slate-400 text-xs">BDT</div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={`${card} p-6 text-slate-300`}>No schedules to show.</div>
          )}
        </div>
      </div>
    </div>
  );
}
