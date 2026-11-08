"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to register.");
      }

      router.push("/account");
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
            Create Your Client Profile
          </h1>
          <p className="text-xs text-elora-gray">
            Join our circle for personalized diagnostic archives and exclusive invitations.
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
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="Sophia Vane"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2.5 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="sophia@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2.5 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
              Password (Minimum 6 Characters)
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2.5 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury hover:bg-elora-taupe transition-colors duration-300 font-medium rounded-sm flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? (
              <span>Registering Profile...</span>
            ) : (
              <>
                <span>Create Client Profile</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-elora-border/60 flex items-center justify-between text-xs text-elora-gray">
          <span>Already registered?</span>
          <Link
            href="/account/login"
            className="text-elora-taupe hover:text-elora-charcoal font-medium underline"
          >
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}

