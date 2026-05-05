"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "ok" | "error";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.message ?? "Subscription failed");
      }
      setStatus("ok");
      setMessage("You're on the list.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
      <input
        type="email"
        required
        placeholder="you@domain.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-md border border-ink/20 bg-paper px-3 py-2 text-sm focus:border-ink focus:outline-none"
        aria-label="Email"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary disabled:opacity-50"
      >
        {status === "submitting" ? "..." : "Subscribe"}
      </button>
      {message ? (
        <p
          className={`text-xs ${status === "error" ? "text-red-600" : "text-muted"}`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
