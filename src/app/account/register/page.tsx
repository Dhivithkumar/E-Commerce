"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
        throw new Error(data.message || "Registration could not be completed.");
      }

      router.push("/account");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[82vh] bg-elora-ivory flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-elora-surface border border-elora-border p-8 sm:p-10 rounded-sm shadow-luxury space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block group">
            <span className="font-editorial text-3xl tracking-[0.22em] text-elora-charcoal uppercase block group-hover:text-elora-taupe transition-colors">
              ÉLORA
            </span>
          </Link>
          <h1 className="font-editorial text-2xl text-elora-charcoal font-normal">
            Create Client Profile
          </h1>
          <p className="text-xs text-elora-gray font-sans font-light">
            Register to preserve personalized diagnostic rituals, track orders, and receive small-batch release privileges.
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
              placeholder="e.g. Eleanor Berkeley"
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
              placeholder="e.g. eleanor@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2.5 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] uppercase tracking-wider text-elora-charcoal">
                Password
              </label>
              <span className="text-[10px] text-elora-gray">Minimum 8 characters</span>
            </div>
            <input
              type="password"
              required
              minLength={8}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-elora-ivory border border-elora-border px-3.5 py-2.5 text-xs text-elora-charcoal focus:outline-none focus:border-elora-taupe rounded-sm"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="forest"
              size="lg"
              isLoading={loading}
              className="w-full shadow-luxury"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-elora-border text-center text-xs text-elora-gray space-y-2">
          <p>
            Already an ÉLORA member?{" "}
            <Link href="/account/login" className="text-elora-taupe underline font-medium">
              Sign In
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-elora-gray">
            <ShieldCheck className="w-3.5 h-3.5 text-elora-taupe" />
            <span>256-Bit SSL Transport Security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
