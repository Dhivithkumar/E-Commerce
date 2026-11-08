"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

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

  const fillCredentials = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError("");
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
            Client Portal Authentication
          </h1>
          <p className="text-xs text-elora-gray font-sans font-light">
            Access your verified rituals, order archives, and personal consultations.
          </p>
        </div>

        {/* Demo Accounts Quick-Select */}
        <div className="p-3.5 bg-elora-cream/50 border border-elora-border rounded-sm text-xs space-y-2">
          <span className="text-[10px] uppercase tracking-ultra text-elora-taupe font-semibold block">
            Demo Test Profiles
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillCredentials("sophia.vane@example.com", "Password123!")}
              className="flex-1 py-1 px-2 bg-elora-surface hover:bg-white border border-elora-border text-[11px] text-elora-charcoal rounded-sm transition-colors"
            >
              Customer Profile
            </button>
            <button
              type="button"
              onClick={() => fillCredentials("admin@elora.luxury", "Password123!")}
              className="flex-1 py-1 px-2 bg-elora-forest text-elora-sand hover:bg-elora-forest/90 text-[11px] rounded-sm transition-colors"
            >
              Executive Admin
            </button>
          </div>
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
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] uppercase tracking-wider text-elora-charcoal">
                Password
              </label>
              <span className="text-[10px] text-elora-gray">Encrypted Bcrypt</span>
            </div>
            <input
              type="password"
              required
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
              <span>Authenticate Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-elora-border text-center text-xs text-elora-gray space-y-2">
          <p>
            Do not possess an ÉLORA account?{" "}
            <Link href="/account/register" className="text-elora-taupe underline font-medium">
              Create an account
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
