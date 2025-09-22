import React, { useEffect, useMemo, useState } from "react";
import BusSeatPlan from "./BusSeatPlan";

export default function TicketBooking({ scheId }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
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
        : prev.length < 4
        ? [...prev, seat.ticket_id]
        : prev
    );
  };

  const selectedSeatInfos = useMemo(
    () => tickets.filter((t) => selectedSeats.includes(t.ticket_id)),
    [tickets, selectedSeats]
  );

  return (
    <div className="mt-4 border-t border-white/20 pt-4 flex gap-6 items-stretch">
      {loading ? (
        <div>Loading seats…</div>
      ) : msg ? (
        <div className="text-rose-400">{msg}</div>
      ) : (
        <>
          <div className="flex-1 flex items-stretch">
            <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 p-4 flex justify-center items-center">
              <BusSeatPlan
                tickets={tickets}
                selectedSeats={selectedSeats}
                onSeatToggle={handleSeatToggle}
              />
            </div>
          </div>

          <div className="flex-1 max-w-lg">
            <PassengerForm
              selectedSeatInfos={selectedSeatInfos}
              onError={(m) => setMsg(m)}
            />
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- Passenger Form ---------------- */

function PassengerForm({ selectedSeatInfos = [], onError }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    nid: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  const input =
    "mt-1 w-full rounded-xl bg-white/5 text-white placeholder-slate-400 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/50";
  const label = "text-slate-200 text-sm";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErr = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 3)
      newErr.fullName = "Please enter a valid full name";
    if (!/^[\w.-]+@gmail\.com$/.test(form.email))
      newErr.email = "Must be a valid Gmail address";
    if (!/^\d{11}$/.test(form.phone))
      newErr.phone = "Phone must be exactly 11 digits";
    if (!/^\d{5,}$/.test(form.nid))
      newErr.nid = "NID must be at least 5 digits";
    if (!form.address.trim() || form.address.trim().length < 10)
      newErr.address = "Please enter a full address (min 10 chars)";
    if (!selectedSeatInfos.length)
      newErr.seats = "Select at least 1 seat";
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:5000/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ticket_ids: selectedSeatInfos.map((s) => s.ticket_id),
        }),
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
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-full flex flex-col">
      <h2 className="text-white text-lg font-medium mb-4">Passenger Form</h2>

      {/* Selected seats preview */}
      <div className="mb-4">
        <p className="text-sm text-slate-300 mb-2">Selected Seats</p>
        {selectedSeatInfos.length ? (
          <div className="grid grid-cols-2 gap-2">
            {selectedSeatInfos.map((s) => (
              <div
                key={s.ticket_id}
                className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-slate-100 text-sm"
              >
                <div className="font-semibold">Seat {s.seatnum}</div>
               
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">
            No seats selected (max 4 allowed)
          </p>
        )}
        {errors.seats && (
          <p className="text-rose-400 text-xs mt-1">{errors.seats}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 flex-1">
        <div>
          <span className={label}>Full Name</span>
          <input
            className={input}
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
          />
          {errors.fullName && (
            <p className="text-rose-400 text-xs">{errors.fullName}</p>
          )}
        </div>

        <div>
          <span className={label}>Email</span>
          <input
            type="email"
            className={input}
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-rose-400 text-xs">{errors.email}</p>
          )}
        </div>

        <div>
          <span className={label}>Phone</span>
          <input
            className={input}
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
          {errors.phone && (
            <p className="text-rose-400 text-xs">{errors.phone}</p>
          )}
        </div>

        <div>
          <span className={label}>NID</span>
          <input
            className={input}
            name="nid"
            value={form.nid}
            onChange={handleChange}
          />
          {errors.nid && (
            <p className="text-rose-400 text-xs">{errors.nid}</p>
          )}
        </div>

        <div>
          <span className={label}>Address</span>
          <textarea
            className={input}
            name="address"
            value={form.address}
            onChange={handleChange}
          />
          {errors.address && (
            <p className="text-rose-400 text-xs">{errors.address}</p>
          )}
        </div>

        <button
          type="submit"
          className="mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium px-5 py-2 w-full"
        >
          Go to Payment
        </button>
      </form>
    </div>
  );
}
