"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Sparkles, Check } from "lucide-react";
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
    <div className="min-h-[85vh] bg-elora-ivory flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl bg-elora-surface border border-elora-border rounded-sm shadow-luxury overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Editorial Visual Column */}
        <div className="hidden lg:block lg:col-span-5 relative bg-elora-forest text-elora-ivory p-10 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <Image
              src="https://images.unsplash.com/photo-1512290900672-1f55b9e03a93?auto=format&fit=crop&w=1200&q=85"
              alt="ÉLORA Compounding Atelier"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-elora-forest via-elora-forest/60 to-transparent" />

          <div className="relative z-10">
            <Link href="/" className="inline-block group">
              <span className="font-editorial text-2xl tracking-[0.25em] text-elora-sand uppercase block group-hover:text-elora-ivory transition-colors">
                ÉLORA
              </span>
              <span className="text-[8px] uppercase tracking-[0.38em] text-elora-sand/70 block font-sans">
                Haute Dermal Science
              </span>
            </Link>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-elora-sand/15 border border-elora-sand/30 rounded-full text-elora-sand text-[10px] uppercase tracking-ultra">
              <Sparkles className="w-3 h-3 text-elora-sand" />
              <span>Private Circle</span>
            </div>
            <p className="font-editorial text-2xl sm:text-3xl text-elora-ivory font-normal leading-snug">
              Begin Your Skincare Journey.
            </p>
            <div className="space-y-2 text-xs text-elora-sand/90 font-sans font-light">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-elora-sand flex-shrink-0" />
                <span>Save algorithmic skin discovery diagnostics</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-elora-sand flex-shrink-0" />
                <span>Real-time international courier tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-elora-sand flex-shrink-0" />
                <span>Small-batch formulation reservation privileges</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-ultra text-elora-taupe font-medium block">
              New Client Profile
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal font-normal">
              Create Client Account
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
    </div>
  );
}
