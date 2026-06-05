"use client";

import { useState } from "react";
import { submitWaitlistLead } from "@/lib/waitlist";
import { waitlistOptions } from "@/config/site";

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
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/70 sm:p-6"
    >
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
          Early access
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
          Join the launch list
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Get first access when curated startup roles and recruiter invites go live.
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        <input
          className="h-12 rounded-md border border-zinc-300 bg-white px-4 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          name="full_name"
          value={form.full_name}
          onChange={updateField}
          placeholder="Full name"
          required
        />

        <input
          className="h-12 rounded-md border border-zinc-300 bg-white px-4 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          name="email"
          type="email"
          value={form.email}
          onChange={updateField}
          placeholder="Email address"
          required
        />

        <input
          className="h-12 rounded-md border border-zinc-300 bg-white px-4 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          name="phone"
          value={form.phone}
          onChange={updateField}
          placeholder="WhatsApp number"
        />

        <select
          className="h-12 rounded-md border border-zinc-300 bg-white px-4 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          name="current_status"
          value={form.current_status}
          onChange={updateField}
          required
        >
          <option value="">Current status</option>
          {waitlistOptions.statuses.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption}
            </option>
          ))}
        </select>

        <select
          className="h-12 rounded-md border border-zinc-300 bg-white px-4 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          name="interest"
          value={form.interest}
          onChange={updateField}
          required
        >
          <option value="">I am interested in</option>
          {waitlistOptions.interests.map((interestOption) => (
            <option key={interestOption} value={interestOption}>
              {interestOption}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="h-12 rounded-md bg-zinc-950 px-5 text-sm font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {loading ? "Joining..." : "Join waitlist"}
        </button>
      </div>

      {message && (
        <p className="mt-4 text-sm font-semibold text-emerald-700">{message}</p>
      )}
    </form>
  );
}
