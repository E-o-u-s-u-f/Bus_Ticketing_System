import React, { useEffect, useState, useMemo } from "react";
import TicketBooking from "./TicketBooking";

export default function ScheduleSearch() {
  const [allSchedules, setAllSchedules] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // Filters
  const [fromLoc, setFromLoc] = useState("");
  const [toLoc, setToLoc] = useState("");
  const [date, setDate] = useState("");
  const [upcomingOnly, setUpcomingOnly] = useState(true);

  // Open dropdown
  const [openSchedule, setOpenSchedule] = useState(null);

  // --- Helpers for "no past days" rule ---
  const ymdLocal = (val) => {
    const dt = new Date(val);
    if (isNaN(dt)) return "";
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const d = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const todayStr = (() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  })();

  // Load schedules
  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/schedules");
        const data = await res.json();
        const rows = data?.data || [];

        // Keep all rows for dropdowns
        setAllSchedules(rows);

        // Show only today+future in list
        const notPastDay = rows.filter((r) => ymdLocal(r.dtime) >= todayStr);
        setSchedules(notPastDay);
      } catch (err) {
        setMsg(err.message || "Failed to load schedules");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fromOptions = useMemo(() => {
    const seen = new Set();
    return allSchedules
      .map((s) => s.fromlocation)
      .filter((f) => (seen.has(f) ? false : seen.add(f)))
      .sort();
  }, [allSchedules]);

  const toOptions = useMemo(() => {
    if (!fromLoc) return [];
    const seen = new Set();
    return allSchedules
      .filter((s) => (s.fromlocation || "").toLowerCase() === fromLoc.toLowerCase())
      .map((s) => s.tolocation)
      .filter((t) => (seen.has(t) ? false : seen.add(t)))
      .sort();
  }, [allSchedules, fromLoc]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!fromLoc || !toLoc || !date) {
      setMsg("Please select From, To, and Date.");
      return;
    }

    // Enforce: no schedules before today (local)
    if (date < todayStr) {
      setSchedules([]);
      setMsg("No schedules found.");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        fromlocation: fromLoc,
        tolocation: toLoc,
        date,
        upcomingOnly: upcomingOnly ? "true" : "false",
      });

      const res = await fetch(`http://localhost:5000/api/schedules?${params.toString()}`);
      const data = await res.json();

      if (!data?.success) throw new Error(data?.message || "Search failed");

      const rows = (data.data || []).filter((r) => ymdLocal(r.dtime) >= todayStr);

      setSchedules(rows);
      setMsg(rows.length === 0 ? "No schedules found." : null);
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
    setSchedules(allSchedules.filter((r) => ymdLocal(r.dtime) >= todayStr));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Search Form */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 mb-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <label className="block">
              <span className="text-slate-200 text-sm">From</span>
              <select
                className="mt-1 w-full rounded-xl bg-white text-black border border-white/10 px-4 py-3 outline-none"
                value={fromLoc}
                onChange={(e) => {
                  setFromLoc(e.target.value);
                  setToLoc("");
                }}
                required
              >
                <option value="">Select</option>
                {fromOptions.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-slate-200 text-sm">To</span>
              <select
                className="mt-1 w-full rounded-xl bg-white text-black border border-white/10 px-4 py-3 outline-none"
                value={toLoc}
                onChange={(e) => setToLoc(e.target.value)}
                required
                disabled={!fromLoc}
              >
                <option value="">{fromLoc ? "Select" : "Choose From first"}</option>
                {toOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-slate-200 text-sm">Date</span>
              <input
                type="date"
                className="mt-1 w-full rounded-xl bg-white text-black border border-white/10 px-4 py-3 outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>

            <div className="md:col-span-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-2">
              <label className="inline-flex items-center gap-2 text-slate-300">
                <input
                  type="checkbox"
                  className="accent-cyan-400 h-4 w-4"
                  checked={upcomingOnly}
                  onChange={(e) => setUpcomingOnly(e.target.checked)}
                />{" "}
                Upcoming only
              </label>
              <div className="ml-auto flex gap-3">
                <button
                  type="button"
                  onClick={clearSearch}
                  className="rounded-xl bg-white/10 text-slate-200 px-4 py-2 hover:bg-white/15"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium px-5 py-2.5 hover:opacity-95"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {msg && (
            <div className={`mt-4 text-sm ${msg.includes("No schedules") ? "text-amber-300" : "text-rose-300"}`}>
              {msg}
            </div>
          )}
        </div>

        {/* Schedule List */}
        <div className="space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 text-slate-300">
              Loading schedules…
            </div>
          ) : schedules.length ? (
            schedules.map((row) => {
              const dt = new Date(row.dtime);
              return (
                <div key={row.scheid} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-white text-lg font-medium">
                        {row.fromlocation} → {row.tolocation}
                      </div>
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

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => setOpenSchedule(openSchedule === row.scheid ? null : row.scheid)}
                      className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white"
                    >
                      {openSchedule === row.scheid ? "Hide Seats" : "View Seats"}
                    </button>
                  </div>

                  {openSchedule === row.scheid && <TicketBooking scheId={row.scheid} />}
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 text-slate-300">
              No schedules to show.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
