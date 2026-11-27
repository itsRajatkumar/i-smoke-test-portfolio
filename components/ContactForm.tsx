"use client";

import { useState, useId } from "react";
import { trackEvent } from "@/lib/analytics";

interface Props {
  onClose?: () => void;
  isModal?: boolean;
}

export function ContactForm({ onClose, isModal = false }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          company_website: honeypot, // Honeypot
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMsg(data.error || "Submission failed. Please try again.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      trackEvent("form_submit", { success: true });
    } catch {
      setErrorMsg("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative w-full max-w-lg rounded-3xl border border-[#00CEC9]/30 bg-[#0d1520]/95 p-8 text-white shadow-2xl backdrop-blur-2xl transition-all ${
        isModal ? "mx-auto" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#00CEC9]">
            Final Chapter · Connect
          </span>
          <h2 className="text-2xl font-black text-white mt-1 tracking-tight">
            Work with Sonia
          </h2>
          <p className="text-xs text-neutral-300 mt-1 max-w-sm">
            Ready to craft messaging people feel and bring structure to growth?
            Leave a note below.
          </p>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            aria-label="Close contact dialog"
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {submitted ? (
        <div className="mt-8 text-center py-6 rounded-2xl bg-[#00CEC9]/10 border border-[#00CEC9]/30">
          <div className="text-4xl mb-3">✨</div>
          <h3 className="text-lg font-bold text-white">Message Delivered</h3>
          <p className="text-xs text-neutral-300 mt-2 px-4">
            Thank you for reaching out. Sonia will get back to you shortly.
          </p>
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="mt-6 text-xs font-semibold px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Close
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs rounded-xl bg-red-500/20 border border-red-500/40 text-red-200">
              {errorMsg}
            </div>
          )}

          {/* Hidden honeypot field for bot trapping */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="company_website">Company Website</label>
            <input
              id="company_website"
              type="text"
              name="company_website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div>
            <label
              htmlFor={nameId}
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5"
            >
              Name
            </label>
            <input
              id={nameId}
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#00CEC9] focus:ring-1 focus:ring-[#00CEC9] transition-all"
            />
          </div>

          <div>
            <label
              htmlFor={emailId}
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5"
            >
              Email Address
            </label>
            <input
              id={emailId}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#00CEC9] focus:ring-1 focus:ring-[#00CEC9] transition-all"
            />
          </div>

          <div>
            <label
              htmlFor={messageId}
              className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5"
            >
              Message
            </label>
            <textarea
              id={messageId}
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell Sonia about your brand, goals or project..."
              className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#00CEC9] focus:ring-1 focus:ring-[#00CEC9] transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-6 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-[#00CEC9] to-[#00B894] hover:from-[#38E8D0] hover:to-[#55EFC4] text-black shadow-lg shadow-[#00CEC9]/20 hover:shadow-[#00CEC9]/40 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Sending..." : "Send Message →"}
          </button>
        </form>
      )}
    </div>
  );
}
