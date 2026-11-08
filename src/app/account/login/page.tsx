"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("sophia.vane@example.com");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to sign in.");
      }

      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-elora-ivory flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-elora-surface border border-elora-border p-8 sm:p-10 rounded-sm shadow-luxury space-y-6">
        <div className="text-center space-y-2">
          <span className="font-editorial text-3xl tracking-[0.2em] text-elora-charcoal uppercase block">
            ÉLORA
          </span>
          <h1 className="font-editorial text-2xl text-elora-charcoal font-normal">
            Client Portal Authentication
          </h1>
          <p className="text-xs text-elora-gray">
            Access your verified rituals, order archives, and personal consultations.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2.5 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2.5 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
            />
          </div>

          <div className="p-3 bg-elora-cream/40 border border-elora-border/60 rounded-sm text-[11px] text-elora-gray space-y-1">
            <p className="font-semibold text-elora-charcoal">Demo Quick Access Credentials:</p>
            <p>Customer: sophia.vane@example.com / Password123!</p>
            <p>Admin: admin@elora.luxury / Password123!</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury hover:bg-elora-taupe transition-colors duration-300 font-medium rounded-sm flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter Portal</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-elora-border/60 flex items-center justify-between text-xs text-elora-gray">
          <span>New to ÉLORA?</span>
          <Link
            href="/account/register"
            className="text-elora-taupe hover:text-elora-charcoal font-medium underline"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

