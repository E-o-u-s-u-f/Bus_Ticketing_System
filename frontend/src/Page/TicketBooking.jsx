import React, { useEffect, useState } from "react";

export default function TicketBooking({ scheId }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");

  useEffect(() => {
    if (!scheId) return;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/tickets/${scheId}`);
        const data = await res.json();
        if (data.success) setTickets(data.tickets);
        else setMsg("Failed to load tickets");
      } catch (err) {
        setMsg(err.message || "Error fetching tickets");
      } finally { setLoading(false); }
    })();
  }, [scheId]);

  const handleSeatClick = seat => {
    if (seat.is_sold) return;
    setSelectedSeat(seat.ticket_id);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!selectedSeat || !userName || !userEmail || !userPhone) {
      setMsg("Please fill all fields and select a seat");
      return;
    }
    // TODO: integrate booking API
    alert(`Seat ${selectedSeat} booked for ${userName}`);
  };

  return (
    <div className="mt-4 border-t border-white/20 pt-4 flex">
      {loading ? <div>Loading seats…</div> :
        msg ? <div className="text-rose-400">{msg}</div> :
          <>
            {/* Bus Seats Grid */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {tickets.map((seat, i) => {
                // add aisle gap after 2nd column
                const style = (i % 4 === 1) ? { marginRight: "0.5rem" } : {};
                return (
                  <button
                    key={seat.ticket_id}
                    style={style}
                    className={`p-2 rounded-lg text-sm font-medium ${seat.is_sold ? "bg-red-600 cursor-not-allowed" : selectedSeat === seat.ticket_id ? "bg-cyan-500" : "bg-green-600 hover:bg-green-500"}`}
                    onClick={() => handleSeatClick(seat)}
                  >
                    {seat.seatnum}
                  </button>
                );
              })}
            </div>

            {/* User Details Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full p-2 rounded-lg text-black"
              />
              <input
                type="email"
                placeholder="Email"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                className="w-full p-2 rounded-lg text-black"
              />
              <input
                type="text"
                placeholder="Phone"
                value={userPhone}
                onChange={e => setUserPhone(e.target.value)}
                className="w-full p-2 rounded-lg text-black"
              />
              <button type="submit" className="w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg hover:opacity-90 text-white font-medium">
                Book Seat
              </button>
            </form>
          </>
      }
    </div>
  );
}