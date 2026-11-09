"use client";

import React, { useState } from "react";
import Image from "next/image";
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
    <div className="min-h-[85vh] bg-elora-ivory flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl bg-elora-surface border border-elora-border rounded-sm shadow-luxury overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Editorial Visual Column */}
        <div className="hidden lg:block lg:col-span-5 relative bg-elora-forest text-elora-ivory p-10 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <Image
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85"
              alt="ÉLORA Atelier Still Life"
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
              <span>Privileged Access</span>
            </div>
            <p className="font-editorial text-2xl sm:text-3xl text-elora-ivory font-normal leading-snug">
              &ldquo;The Science of Beautiful Skin.&rdquo;
            </p>
            <p className="text-xs text-elora-sand/80 font-sans font-light leading-relaxed">
              Sign in to consult tailored active formulations, track international courier parcels, and preserve your personal skin health archives.
            </p>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-ultra text-elora-taupe font-medium block">
              Atelier Portal
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal font-normal">
              Client Portal Authentication
            </h1>
            <p className="text-xs text-elora-gray font-sans font-light">
              Access your verified rituals, order archives, and personal consultations.
            </p>
          </div>

          {/* Demo Accounts Quick-Select */}
          <div className="p-4 bg-elora-cream/40 border border-elora-border rounded-sm text-xs space-y-2.5">
            <span className="text-[10px] uppercase tracking-ultra text-elora-taupe font-semibold block">
              Instant Demonstration Profiles
            </span>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => fillCredentials("sophia.vane@example.com", "Password123!")}
                className="flex-1 py-1.5 px-3 bg-elora-surface hover:bg-white border border-elora-border text-[11px] text-elora-charcoal rounded-sm transition-colors text-center"
              >
                Customer Profile (Sophia)
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("admin@elora.luxury", "Password123!")}
                className="flex-1 py-1.5 px-3 bg-elora-forest text-elora-sand hover:bg-elora-forest/90 text-[11px] rounded-sm transition-colors text-center"
              >
                Executive Admin (Director)
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
    </div>
  );
}
