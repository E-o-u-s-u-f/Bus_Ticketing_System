import React from "react";

export default function BusSeatPlan({ tickets = [], selectedSeat, onSeatClick }) {
  // Normalize and group tickets by row letter (A–D), then sort by seat number (1–10)
  const parseSeat = (seatnum) => {
    if (!seatnum) return { row: "", num: NaN };
    const m = String(seatnum).trim().toUpperCase().match(/^([A-D])\s*0*([1-9]|10)$/);
    return m ? { row: m[1], num: Number(m[2]) } : { row: "", num: NaN };
  };

  const groups = { A: [], B: [], C: [], D: [] };

  for (const seat of Array.isArray(tickets) ? tickets : []) {
    const { row, num } = parseSeat(seat.seatnum);
    if (row && !Number.isNaN(num) && groups[row]) {
      groups[row].push({ ...seat, _num: num, _row: row });
    }
  }

  // Sort each group numerically by seat number
  (["A", "B", "C", "D"]).forEach((r) => {
    groups[r].sort((s1, s2) => s1._num - s2._num);
  });

  const renderColumn = (col, label) => (
    <div className="flex flex-col items-center gap-2">
      {/* Optional column label */}
      <div className="text-slate-300 text-xs mb-1">{label}</div>
      {col.map((seat) => (
        <button
          key={seat.ticket_id}
          onClick={() => !seat.is_sold && onSeatClick(seat)}
          disabled={seat.is_sold}
          className={`w-12 h-12 rounded-md shadow font-medium transition
            ${seat.is_sold
              ? "bg-red-600 cursor-not-allowed text-white/80"
              : selectedSeat === seat.ticket_id
              ? "bg-cyan-500 text-white"
              : "bg-green-600 hover:bg-green-500 text-white"
            }`}
          title={'${seat.seatnum}'}
        >
          {seat.seatnum}
        </button>
      ))}
    </div>
  );

  // If nothing came back, still render a friendly note
  const totalSeats = (groups.A.length + groups.B.length + groups.C.length + groups.D.length);

  if (totalSeats === 0) {
    return (
      <div className="text-slate-300 p-4 rounded-lg bg-white/5 border border-white/10">
        No seats to display for this schedule.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start gap-8 p-4 rounded-lg bg-white/5 border border-white/10">
      {/* Left side (A & B) */}
      <div className="flex gap-4">
        {renderColumn(groups.A, "A")}
        {renderColumn(groups.B, "B")}
      </div>

      {/* Aisle */}
      <div className="w-8" />

      {/* Right side (C & D) */}
      <div className="flex gap-4">
        {renderColumn(groups.C, "C")}
        {renderColumn(groups.D, "D")}
      </div>
    </div>
  );
}