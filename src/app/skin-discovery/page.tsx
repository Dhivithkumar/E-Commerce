"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  ShoppingBag,
  RotateCcw,
  Droplets,
  Sun,
  Shield,
  Layers,
} from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";

const SKIN_TYPES = [
  {
    id: "dry",
    title: "Dry / Depleted",
    desc: "Feels tight after cleansing, lacks native oil, prone to flaking or dullness.",
  },
  {
    id: "combination",
    title: "Balanced / Combination",
    desc: "Slight oiliness across the T-zone with drier cheeks and perimeter.",
  },
  {
    id: "sensitive",
    title: "Sensitive / Reactive",
    desc: "Easily irritated by environmental changes, prone to erythema and stinging.",
  },
  {
    id: "oily",
    title: "Oily / Congested",
    desc: "Excess sebum production throughout the day, enlarged pores, prone to blemishes.",
  },
];

const CONCERNS = [
  { id: "barrier", title: "Compromised Barrier & Redness", icon: Shield },
  { id: "hydration", title: "Dehydration & Lack of Plumpness", icon: Droplets },
  { id: "anti-aging", title: "Fine Lines & Dermal Elasticity", icon: Layers },
  { id: "texture", title: "Micro-Texture & Enlarged Pores", icon: Sparkles },
  { id: "sun-protection", title: "Photoprotection & Blue Light Defense", icon: Sun },
];

const ENVIRONMENTS = [
  { id: "urban", title: "Urban City • High Airborne Pollution & Free Radicals" },
  { id: "dry-climate", title: "Arid / Desert • High HVAC & Low Humidity" },
  { id: "temperate", title: "Temperate • Variable Seasonal Transitions" },
  { id: "humid", title: "Tropical • High Humidity & Intense UV Index" },
];

const PREFERENCES = [
  { id: "2-step", title: "Minimalist Ritual (Cleanse & Hydrate)" },
  { id: "3-step", title: "Core Regimen (Cleanse, Treat & Hydrate)" },
  { id: "4-step", title: "Master 4-Step Regimen (Cleanse, Treat, Hydrate & Protect)" },
];

export default function SkinDiscoveryPage() {
  const { addItem, applyCoupon } = useCart();
  const { formatPrice } = useCurrency();

  const [step, setStep] = useState<number>(0); // 0 = Intro, 1..4 = Questions, 5 = Results
  const [skinType, setSkinType] = useState<string>("");
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [environment, setEnvironment] = useState<string>("");
  const [preference, setPreference] = useState<string>("4-step");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [addedAll, setAddedAll] = useState(false);

  const toggleConcern = (id: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleDiagnose = async () => {
    setLoading(true);
    setStep(5);

    try {
      const res = await fetch("/api/ai/skin-discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skinType,
          concerns: selectedConcerns,
          environment,
          routinePreference: preference,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllToCart = async () => {
    if (!result?.routine) return;

    for (const item of result.routine) {
      addItem(
        {
          id: item.variantId || item.id,
          productId: item.id,
          name: item.name,
          subtitle: item.subtitle,
          variantTitle: item.step,
          sku: item.slug,
          price: item.price,
          image: item.imageUrl,
          maxStock: 50,
        },
        1
      );
    }

    // Auto apply welcome coupon
    await applyCoupon("WELCOME15");
    setAddedAll(true);
  };

  return (
    <div className="bg-elora-ivory min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step 0: Editorial Introduction */}
        {step === 0 && (
          <div className="bg-elora-surface border border-elora-border p-8 sm:p-14 rounded-sm shadow-luxury text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-elora-forest/10 border border-elora-forest/20 rounded-full text-elora-forest text-xs tracking-ultra uppercase font-sans">
              <Sparkles className="w-3.5 h-3.5 text-elora-taupe" />
              <span>Biomimetic Skincare Diagnostic</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-6xl text-elora-charcoal font-normal leading-tight">
              Personalized Skincare Diagnostic
            </h1>

            <p className="text-xs sm:text-sm text-elora-gray max-w-xl mx-auto leading-relaxed font-sans">
              Our diagnostic engine evaluates your epidermal barrier integrity, lifestyle stressors, and moisture retention tiers. Through algorithmic compatibility matching, we formulate a harmonious ritual unique to your complexion.
            </p>

            <div className="pt-4 flex justify-center">
              <button
                onClick={() => setStep(1)}
                className="px-8 py-4 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury hover:bg-elora-taupe transition-colors duration-300 rounded-sm font-medium flex items-center gap-2 group shadow-md"
              >
                <span>Initiate Diagnostic (2 Mins)</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <p className="text-[11px] text-elora-gray/80 pt-4 border-t border-elora-border/60 max-w-md mx-auto">
              Diagnostic notice: This experience provides cosmetic formulation recommendations for daily skincare ceremonies and does not constitute clinical medical diagnosis.
            </p>
          </div>
        )}

        {/* Step 1 to 4: Interactive Diagnostic Flow */}
        {step >= 1 && step <= 4 && (
          <div className="bg-elora-surface border border-elora-border p-8 sm:p-12 rounded-sm shadow-luxury space-y-8">
            {/* Progress Header */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs uppercase tracking-ultra text-elora-gray">
                <span>Diagnostic Step {step} of 4</span>
                <span className="text-elora-taupe font-semibold">{step * 25}% Complete</span>
              </div>
              <div className="w-full bg-elora-border h-1 rounded-full overflow-hidden">
                <div
                  className="bg-elora-taupe h-full transition-all duration-500 ease-out"
                  style={{ width: `${step * 25}%` }}
                />
              </div>
            </div>

            {/* Question 1: Skin Type */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal">
                    How does your complexion behave throughout the day?
                  </h2>
                  <p className="text-xs text-elora-gray mt-1">
                    Select the profile that most accurately mirrors your bare skin two hours after cleansing.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SKIN_TYPES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSkinType(t.id)}
                      className={`p-5 text-left border rounded-sm transition-all ${
                        skinType === t.id
                          ? "border-elora-charcoal bg-elora-cream/40 ring-1 ring-elora-charcoal"
                          : "border-elora-border/70 hover:border-elora-border bg-elora-surface"
                      }`}
                    >
                      <h3 className="font-editorial text-xl text-elora-charcoal font-medium">
                        {t.title}
                      </h3>
                      <p className="text-xs text-elora-gray mt-1 leading-relaxed">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Question 2: Primary Concerns */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal">
                    Which target concerns do you wish to address?
                  </h2>
                  <p className="text-xs text-elora-gray mt-1">
                    Select all that apply. Our engine will prioritize active compatibility.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CONCERNS.map((c) => {
                    const Icon = c.icon;
                    const isSelected = selectedConcerns.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleConcern(c.id)}
                        className={`p-4 text-left border rounded-sm flex items-center justify-between transition-all ${
                          isSelected
                            ? "border-elora-charcoal bg-elora-cream/40 ring-1 ring-elora-charcoal"
                            : "border-elora-border/70 hover:border-elora-border bg-elora-surface"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-elora-taupe" />
                          <span className="text-xs font-medium text-elora-charcoal">{c.title}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-elora-charcoal" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Question 3: Environment */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal">
                    What is your prevailing daily living climate?
                  </h2>
                  <p className="text-xs text-elora-gray mt-1">
                    Ambient humidity and free radical exposure heavily modulate moisture evaporation rates.
                  </p>
                </div>

                <div className="space-y-3">
                  {ENVIRONMENTS.map((env) => (
                    <button
                      key={env.id}
                      onClick={() => setEnvironment(env.id)}
                      className={`w-full p-4 text-left border rounded-sm transition-all text-xs font-medium ${
                        environment === env.id
                          ? "border-elora-charcoal bg-elora-cream/40 ring-1 ring-elora-charcoal text-elora-charcoal"
                          : "border-elora-border/70 hover:border-elora-border bg-elora-surface text-elora-gray"
                      }`}
                    >
                      {env.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Question 4: Ritual Preference */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal">
                    What is your desired ritual ceremony complexity?
                  </h2>
                  <p className="text-xs text-elora-gray mt-1">
                    Select how many minutes you prefer to dedicate morning and night.
                  </p>
                </div>

                <div className="space-y-3">
                  {PREFERENCES.map((pref) => (
                    <button
                      key={pref.id}
                      onClick={() => setPreference(pref.id)}
                      className={`w-full p-4 text-left border rounded-sm transition-all text-xs font-medium ${
                        preference === pref.id
                          ? "border-elora-charcoal bg-elora-cream/40 ring-1 ring-elora-charcoal text-elora-charcoal"
                          : "border-elora-border/70 hover:border-elora-border bg-elora-surface text-elora-gray"
                      }`}
                    >
                      {pref.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step Navigation Controls */}
            <div className="pt-6 border-t border-elora-border/60 flex items-center justify-between">
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 border border-elora-border text-xs uppercase tracking-wider text-elora-charcoal hover:bg-elora-cream rounded-sm flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {step < 4 ? (
                <button
                  disabled={
                    (step === 1 && !skinType) ||
                    (step === 2 && selectedConcerns.length === 0) ||
                    (step === 3 && !environment)
                  }
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2.5 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury hover:bg-elora-taupe rounded-sm flex items-center gap-2 disabled:opacity-40"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleDiagnose}
                  className="px-8 py-3 bg-elora-forest text-elora-sand hover:bg-elora-taupe hover:text-white text-xs uppercase tracking-luxury font-medium rounded-sm flex items-center gap-2 shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesize Prescribed Ritual</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Loading State or Prescribed Results */}
        {step === 5 && (
          <div>
            {loading ? (
              <div className="bg-elora-surface border border-elora-border p-16 rounded-sm text-center space-y-4 shadow-luxury">
                <div className="w-12 h-12 rounded-full bg-elora-forest text-elora-sand flex items-center justify-center mx-auto animate-pulse">
                  <Sparkles className="w-6 h-6 animate-spin" />
                </div>
                <h3 className="font-editorial text-3xl text-elora-charcoal">
                  Synthesizing Dermal Compatibility
                </h3>
                <p className="text-xs text-elora-gray max-w-sm mx-auto leading-relaxed">
                  Evaluating lipid replenishment ratios, osmoprotectants, and molecular peptide compatibility...
                </p>
              </div>
            ) : result ? (
              <div className="space-y-10">
                {/* Consultation Card */}
                <div className="bg-elora-surface border border-elora-border p-8 sm:p-10 rounded-sm shadow-luxury space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-elora-border/60 gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-ultra text-elora-taupe font-medium">
                        Prescribed Diagnostic Protocol
                      </span>
                      <h2 className="font-editorial text-3xl sm:text-4xl text-elora-charcoal mt-0.5">
                        Your Harmonized Cellular Ritual
                      </h2>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 bg-elora-forest text-elora-sand rounded-full uppercase tracking-wider h-fit">
                      {result.skinType} Protocol
                    </span>
                  </div>

                  <div className="prose text-xs sm:text-sm text-elora-gray font-sans leading-relaxed whitespace-pre-line">
                    {result.rationale}
                  </div>
                </div>

                {/* Formulations in the Ritual */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-editorial text-2xl text-elora-charcoal">
                      Prescribed Formulations ({result.routine?.length || 0})
                    </h3>
                    <span className="text-xs text-elora-taupe font-medium">
                      Step-by-Step Layering Protocol
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {result.routine?.map((item: any, idx: number) => (
                      <div
                        key={item.id}
                        className="bg-elora-surface border border-elora-border p-5 rounded-sm flex gap-4 shadow-sm"
                      >
                        <div className="relative w-20 h-24 bg-elora-cream rounded-sm overflow-hidden flex-shrink-0">
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-elora-forest font-semibold">
                              Step {idx + 1} • {item.step}
                            </span>
                            <Link href={`/shop/${item.slug}`}>
                              <h4 className="font-editorial text-lg text-elora-charcoal hover:text-elora-taupe line-clamp-1">
                                {item.name}
                              </h4>
                            </Link>
                            <p className="text-[11px] text-elora-gray line-clamp-1">{item.subtitle}</p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-elora-border/60 text-xs">
                            <span className="font-medium text-elora-charcoal">
                              {formatPrice(item.price)}
                            </span>
                            <span className="text-[10px] text-elora-gray">{item.volume}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add All to Cart CTA & Welcome Gift */}
                <div className="bg-elora-forest text-elora-ivory p-8 rounded-sm shadow-luxury flex flex-col sm:flex-row items-center justify-between gap-6 border border-elora-sand/20">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[10px] uppercase tracking-ultra text-elora-sand font-medium">
                      Diagnostic Privilege Gift
                    </span>
                    <h3 className="font-editorial text-2xl text-elora-ivory">
                      Begin Your Full Prescribed Ritual
                    </h3>
                    <p className="text-xs text-elora-sand/80 font-sans">
                      Enjoy 15% complimentary savings with privilege code{" "}
                      <strong className="text-elora-sand">WELCOME15</strong> automatically applied.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      onClick={handleAddAllToCart}
                      disabled={addedAll}
                      className="px-6 py-3.5 bg-elora-sand text-elora-forest hover:bg-elora-ivory text-xs uppercase tracking-luxury font-medium transition-colors rounded-sm flex items-center justify-center gap-2 whitespace-nowrap shadow-md"
                    >
                      {addedAll ? (
                        <>
                          <Check className="w-4 h-4 text-elora-forest" />
                          <span>All Formulations Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add Complete Ritual to Bag</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setStep(1)}
                      className="px-4 py-3 bg-white/10 text-elora-sand hover:bg-white/20 text-xs uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

