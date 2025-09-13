import React from "react";

export default function BusSeatPlan({ tickets = [], selectedSeat, onSeatClick }) {
  // Expect 40 seats; render what we have
  const seats = Array.isArray(tickets) ? tickets : [];

  // If nothing came back, still render a friendly note (prevents “nothing on screen”)
  if (seats.length === 0) {
    return (
      <div className="text-slate-300 p-4 rounded-lg bg-white/5 border border-white/10">
        No seats to display for this schedule.
      </div>
    );
  }

  // Split into 4 columns (10 each)
  const col1 = seats.slice(0, 10);
  const col2 = seats.slice(10, 20);
  const col3 = seats.slice(20, 30);
  const col4 = seats.slice(30, 40);

  const renderColumn = (col) => (
    <div className="flex flex-col gap-2">
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
          title={seat.seatnum}
        >
          {seat.seatnum}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex justify-center items-start gap-8 p-4 rounded-lg bg-white/5 border border-white/10">
      {/* Left side (Col 1 & 2) */}
      <div className="flex gap-4">
        {renderColumn(col1)}
        {renderColumn(col2)}
      </div>

      {/* Aisle gap */}
      <div className="w-8" />

      {/* Right side (Col 3 & 4) */}
      <div className="flex gap-4">
        {renderColumn(col3)}
        {renderColumn(col4)}
      </div>
    </div>
  );
}