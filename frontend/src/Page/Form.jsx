import React, { useState } from "react";

export default function Form() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    nid: "",
    address: "",
    ticket_ids: [""], // now an array
  });

  const input =
    "mt-1 w-full rounded-xl bg-white/5 text-white placeholder-slate-400 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/50";
  const label = "text-slate-200 text-sm";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTicketChange = (index, value) => {
    const newTickets = [...form.ticket_ids];
    newTickets[index] = value;
    setForm({ ...form, ticket_ids: newTickets });
  };

  const addTicketField = () => {
    setForm({ ...form, ticket_ids: [...form.ticket_ids, ""] });
  };

  const removeTicketField = (index) => {
    const newTickets = form.ticket_ids.filter((_, i) => i !== index);
    setForm({ ...form, ticket_ids: newTickets });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form); 
    fetch("http://localhost:5000/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      .then(res=>res.json())
       .then((result)=>{
        window.location.replace(result.url);
       console.log(result);
       })// just log the data for now
  };

  return (
    <div className="max-w-md mx-auto bg-white/5 p-6 rounded-2xl border border-white/10">
      <h2 className="text-white text-lg font-medium mb-4">Passenger Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className={label}>Full Name</span>
          <input
            className={input}
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
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
          />
        </label>
        <label className="block">
          <span className={label}>Phone</span>
          <input
            className={input}
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </label>
        <label className="block">
          <span className={label}>NID</span>
          <input
            className={input}
            name="nid"
            value={form.nid}
            onChange={handleChange}
          />
        </label>
        <label className="block">
          <span className={label}>Address</span>
          <textarea
            className={input}
            name="address"
            value={form.address}
            onChange={handleChange}
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
