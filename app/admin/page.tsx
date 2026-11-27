"use client";

import { useState } from "react";

interface FunnelItem {
  chapter: string;
  visitors: number;
}

interface StationItem {
  name: string;
  count: number;
}

interface ContactItem {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface StatsData {
  totalVisitors: number;
  totalEvents: number;
  totalContacts: number;
  funnel: FunnelItem[];
  mostOpenedStations: StationItem[];
  scrollDepths: Record<string, number>;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState<StatsData | null>(null);
  const [contacts, setContacts] = useState<ContactItem[]>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMsg(data.error || "Invalid password.");
        setLoading(false);
        return;
      }

      setStats(data.stats);
      setContacts(data.contacts || []);
      setAuthenticated(true);
    } catch {
      setErrorMsg("Network error contacting admin API.");
    } finally {
      setLoading(false);
    }
  };

  /* Password Gate View */
  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1117] p-4 text-white">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#161b22] p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-black tracking-tight text-white">
              Admin Portal
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Sonia Career Journey Analytics
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-2.5 rounded-lg bg-red-500/20 border border-red-500/40 text-xs text-red-200 text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin_password"
                className="block text-xs uppercase font-semibold text-neutral-400 mb-1"
              >
                Password
              </label>
              <input
                id="admin_password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00CEC9] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#00CEC9] hover:bg-[#38E8D0] font-bold text-sm text-black transition-all cursor-pointer"
            >
              {loading ? "Authenticating..." : "Sign In →"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const maxFunnel = stats
    ? Math.max(...stats.funnel.map((f) => f.visitors), 1)
    : 1;

  const maxStation = stats?.mostOpenedStations.length
    ? Math.max(...stats.mostOpenedStations.map((s) => s.count), 1)
    : 1;

  /* Dashboard View */
  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl font-black text-white">
              Journey Analytics Dashboard
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Real-time anonymous session funnels, station interest, and contact
              inquiries
            </p>
          </div>
          <button
            onClick={() => setAuthenticated(false)}
            className="text-xs px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 transition-colors w-fit"
          >
            Log Out
          </button>
        </div>

        {/* Metric Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-white/10 bg-[#161b22] p-6">
              <span className="text-xs font-bold uppercase text-neutral-400">
                Unique Visitors
              </span>
              <p className="text-4xl font-extrabold text-[#00CEC9] mt-2">
                {stats.totalVisitors}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Distinct anonymous sessions
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#161b22] p-6">
              <span className="text-xs font-bold uppercase text-neutral-400">
                Contact Inquiries
              </span>
              <p className="text-4xl font-extrabold text-[#55EFC4] mt-2">
                {stats.totalContacts}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Form submissions received
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#161b22] p-6">
              <span className="text-xs font-bold uppercase text-neutral-400">
                Total Tracked Events
              </span>
              <p className="text-4xl font-extrabold text-[#74B9FF] mt-2">
                {stats.totalEvents}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Chapter enters, stations, scroll ticks
              </p>
            </div>
          </div>
        )}

        {/* Chapter Drop-off Funnel */}
        {stats && (
          <div className="rounded-2xl border border-white/10 bg-[#161b22] p-6">
            <h2 className="text-base font-bold text-white mb-4">
              Chapter Drop-off Funnel
            </h2>
            <div className="space-y-3">
              {stats.funnel.map((item) => {
                const pct = Math.round((item.visitors / maxFunnel) * 100);
                return (
                  <div key={item.chapter} className="space-y-1">
                    <div className="flex justify-between text-xs text-neutral-300">
                      <span className="font-semibold">{item.chapter}</span>
                      <span>
                        {item.visitors} visitor{item.visitors === 1 ? "" : "s"}
                      </span>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#74B9FF] to-[#00CEC9] rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(pct, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Most Opened Stations */}
        {stats && (
          <div className="rounded-2xl border border-white/10 bg-[#161b22] p-6">
            <h2 className="text-base font-bold text-white mb-4">
              Most Opened Career Stations
            </h2>
            {stats.mostOpenedStations.length === 0 ? (
              <p className="text-xs text-neutral-500">
                No station clicks recorded yet.
              </p>
            ) : (
              <div className="space-y-3">
                {stats.mostOpenedStations.map((st) => {
                  const pct = Math.round((st.count / maxStation) * 100);
                  return (
                    <div key={st.name} className="space-y-1">
                      <div className="flex justify-between text-xs text-neutral-300">
                        <span className="font-semibold">{st.name}</span>
                        <span>
                          {st.count} click{st.count === 1 ? "" : "s"}
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#FF8A65] to-[#FDCB6E] rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(pct, 5)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Messages List */}
        <div className="rounded-2xl border border-white/10 bg-[#161b22] p-6">
          <h2 className="text-base font-bold text-white mb-4">
            Contact Messages ({contacts.length})
          </h2>
          {contacts.length === 0 ? (
            <p className="text-xs text-neutral-500">
              No messages submitted yet.
            </p>
          ) : (
            <div className="divide-y divide-white/10">
              {contacts.map((msg) => (
                <div key={msg.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                    <span className="font-bold text-white text-sm">
                      {msg.name}
                    </span>
                    <div className="flex items-center gap-3 text-neutral-400">
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-[#00CEC9] hover:underline"
                      >
                        {msg.email}
                      </a>
                      <span>·</span>
                      <span>
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-300 mt-2 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
