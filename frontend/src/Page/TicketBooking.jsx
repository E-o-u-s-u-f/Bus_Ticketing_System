import React, { useEffect, useMemo, useState } from "react";
import BusSeatPlan from "./BusSeatPlan";

export default function TicketBooking({ scheId }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // MULTI-SELECT seats (array of ticket_ids)
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    if (!scheId) return;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/tickets/${scheId}`);
        const data = await res.json();
        if (data?.success) setTickets(data.tickets || []);
        else setMsg("Failed to load tickets");
      } catch (err) {
        setMsg(err?.message || "Error fetching tickets");
      } finally {
        setLoading(false);
      }
    })();
  }, [scheId]);

  const handleSeatToggle = (seat) => {
    if (!seat || seat.is_sold) return;
    setSelectedSeats((prev) =>
      prev.includes(seat.ticket_id)
        ? prev.filter((id) => id !== seat.ticket_id)
        : [...prev, seat.ticket_id]
    );
  };

  const selectedSeatInfos = useMemo(
    () => tickets.filter((t) => selectedSeats.includes(t.ticket_id)),
    [tickets, selectedSeats]
  );

  return (
    <div className="mt-4 border-t border-white/20 pt-4 flex gap-6">
      {loading ? (
        <div>Loading seats…</div>
      ) : msg ? (
        <div className="text-rose-400">{msg}</div>
      ) : (
        <>
          {/* LEFT: Bus Seats Grid */}
          <BusSeatPlan
            tickets={tickets}
            selectedSeats={selectedSeats}
            onSeatToggle={handleSeatToggle}
          />

          {/* RIGHT: Passenger Form (keeps the flex layout) */}
          <div className="flex-1 max-w-md">
            <PassengerForm
              selectedSeats={selectedSeats}
              onError={(m) => setMsg(m)}
            />

            {/* helper text */}
            {selectedSeats.length ? (
              <p className="mt-2 text-xs text-slate-300">
                Selected:{" "}
                <span className="font-mono">
                  {selectedSeatInfos.map((s) => s.seatnum).join(", ")}
                </span>
              </p>
            ) : (
              <p className="mt-2 text-xs text-slate-400">
                Tip: click multiple free seats to auto-fill the Ticket IDs.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- Passenger Form (merges selected seats → ticket_ids) ---------------- */

function PassengerForm({ selectedSeats = [], onError }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    nid: "",
    address: "",
    ticket_ids: [""],
  });

  // Whenever selectedSeats changes, merge them into ticket_ids (selected first, deduped)
  useEffect(() => {
    if (!Array.isArray(selectedSeats)) return;
    setForm((prev) => {
      const sel = selectedSeats.map(String);
      const existing = (prev.ticket_ids || []).map(String);
      // Keep any manual entries that aren't in selected
      const manualRest = existing.filter((id) => id && !sel.includes(id));
      const merged = [...sel, ...manualRest];
      return { ...prev, ticket_ids: merged.length ? merged : [""] };
    });
  }, [selectedSeats]);

  const input =
    "mt-1 w-full rounded-xl bg-white/5 text-white placeholder-slate-400 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/50";
  const label = "text-slate-200 text-sm";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleTicketChange = (index, value) => {
    const newTickets = [...form.ticket_ids];
    newTickets[index] = value;
    setForm({ ...form, ticket_ids: newTickets });
  };

  const addTicketField = () =>
    setForm({ ...form, ticket_ids: [...form.ticket_ids, ""] });

  const removeTicketField = (index) => {
    const newTickets = form.ticket_ids.filter((_, i) => i !== index);
    setForm({ ...form, ticket_ids: newTickets.length ? newTickets : [""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredOk =
      form.fullName && form.email && form.phone && form.ticket_ids.filter(Boolean).length;
    if (!requiredOk) {
      onError?.("Please fill required fields and add at least one Ticket ID.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (result?.url) {
        window.location.replace(result.url);
        return;
      }
      alert(`Submitted! Reference: ${result?.reference || "N/A"}`);
    } catch (err) {
      onError?.(err?.message || "Payment request failed.");
    }
  };

  return (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
      <h2 className="text-white text-lg font-medium mb-4">Passenger Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className={label}>Full Name</span>
          <input
            className={input}
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="e.g. Tahmid Khan"
          />
        </label>

        <label className="block">
          <span className={label}>Email</span>
          <input
            type="email"
            className={input}
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className={label}>Phone</span>
          <input
            className={input}
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="01xxxxxxxxx"
          />
        </label>

        <label className="block">
          <span className={label}>NID</span>
          <input
            className={input}
            name="nid"
            value={form.nid}
            onChange={handleChange}
            placeholder="National ID"
          />
        </label>

        <label className="block">
          <span className={label}>Address</span>
          <textarea
            className={input}
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Street, City, Postcode"
          />
        </label>

        {/* Multiple Ticket IDs */}
        <div className="space-y-3">
          <span className={label}>Ticket IDs</span>
          {form.ticket_ids.map((ticket, index) => (
            <div key={index} className="flex gap-2">
              <input
                className={input + " flex-1"}
                value={ticket}
                onChange={(e) => handleTicketChange(index, e.target.value)}
                placeholder={`Ticket ID #${index + 1}`}
              />
              {form.ticket_ids.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTicketField(index)}
                  className="px-3 py-2 bg-rose-500 text-white rounded-xl"
                  title="Remove"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTicketField}
            className="px-4 py-2 text-sm text-white bg-emerald-500 rounded-xl"
          >
            + Add Ticket
          </button>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium px-5 py-2"
        >
          Save
        </button>
      </form>
    </div>
  );
}

