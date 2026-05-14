"use client";

import { useState } from "react";
import { submitWaitlistLead } from "@/lib/waitlist";

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  current_status: "",
  interest: "",
};

export function WaitlistForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function updateField(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      await submitWaitlistLead({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        current_status: form.current_status,
        interest: form.interest,
        source: "landing_page",
      });

      setForm(initialForm);
      setMessage("You are on the waitlist. We will contact you soon.");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="waitlist-form">
      <input
        name="full_name"
        value={form.full_name}
        onChange={updateField}
        placeholder="Full name"
        required
      />

      <input
        name="email"
        type="email"
        value={form.email}
        onChange={updateField}
        placeholder="Email address"
        required
      />

      <input
        name="phone"
        value={form.phone}
        onChange={updateField}
        placeholder="WhatsApp number"
      />

      <select
        name="current_status"
        value={form.current_status}
        onChange={updateField}
        required
      >
        <option value="">Current status</option>
        <option value="Student">Student</option>
        <option value="Fresher">Fresher</option>
        <option value="Working professional">Working professional</option>
      </select>

      <select
        name="interest"
        value={form.interest}
        onChange={updateField}
        required
      >
        <option value="">I am interested in</option>
        <option value="Fresher jobs">Fresher jobs</option>
        <option value="Internships">Internships</option>
        <option value="Resume builder">Resume builder</option>
        <option value="Premium alerts">Premium alerts</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "Joining..." : "Join Waitlist"}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}