import React from "react";

export default function BusSeatPlan() {
  // Generate seat numbers dynamically (40 seats)
  const seats = Array.from({ length: 40 }, (_, i) => i + 1);

  // Split into 4 columns of 10
  const col1 = seats.slice(0, 10);
  const col2 = seats.slice(10, 20);
  const col3 = seats.slice(20, 30);
  const col4 = seats.slice(30, 40);

  return (
    <div className="flex justify-center items-start gap-8 p-6">
      {/* Left side (Col 1 & 2) */}
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          {col1.map((num) => (
            <button
              key={num}
              className="w-12 h-12 bg-green-500 text-white rounded-md shadow"
            >
              {num}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {col2.map((num) => (
            <button
              key={num}
              className="w-12 h-12 bg-green-500 text-white rounded-md shadow"
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Aisle gap */}
      <div className="w-8"></div>

      {/* Right side (Col 3 & 4) */}
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          {col3.map((num) => (
            <button
              key={num}
              className="w-12 h-12 bg-green-500 text-white rounded-md shadow"
            >
              {num}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {col4.map((num) => (
            <button
              key={num}
              className="w-12 h-12 bg-green-500 text-white rounded-md shadow"
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}