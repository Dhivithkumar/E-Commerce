"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, X, Send, Bot, User, ArrowRight, ShieldCheck } from "lucide-react";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { useCart } from "@/components/providers/CartProvider";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  products?: {
    id: string;
    name: string;
    slug: string;
    subtitle?: string;
    price: number;
    imageUrl: string;
    variantId?: string;
  }[];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome-1",
    role: "assistant",
    content: "Welcome to ÉLORA. I am your personal Skincare Concierge, trained on our clinical formulations, physiological lipid science, and verified customer rituals. How may I guide your skin journey today?",
  },
];

const SUGGESTED_QUERIES = [
  "Lightweight moisturizer for combination skin",
  "Explain the Triple Hyaluronic Complex",
  "How should I layer serum and crème?",
  "What is your 30-Day Ritual Guarantee?",
];

export default function AiChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (userPrompt?: string) => {
    const textToSend = (userPrompt || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "I am reflecting on your skin preferences. Please allow me a moment.",
        products: data.products,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Our formulation archives are currently performing a routine synchronization. In the meantime, our Barrier Restorative Crème and Cellular Renewal Concentrate remain our most acclaimed recommendations.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open ÉLORA AI Skincare Concierge"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-elora-forest text-elora-ivory rounded-full shadow-luxury hover:bg-elora-taupe transition-all duration-300 group border border-elora-sand/30"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-elora-sand opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-elora-sand"></span>
        </span>
        <Sparkles className="w-4 h-4 text-elora-sand group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-medium uppercase tracking-luxury hidden sm:inline">
          AI Skincare Concierge
        </span>
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-elora-charcoal/40 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <div className="w-screen max-w-lg bg-elora-ivory shadow-drawer flex flex-col border-l border-elora-border">
              {/* Header */}
              <div className="px-6 py-4 bg-elora-forest text-elora-ivory flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-elora-sand/20 border border-elora-sand/40 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-elora-sand" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-lg tracking-wide text-elora-sand">
                      ÉLORA AI Concierge
                    </h3>
                    <p className="text-[11px] text-elora-sand/80 tracking-widest uppercase">
                      Physiological Skincare Advisor
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-elora-sand/80 hover:text-elora-ivory hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Verified Trust Strip */}
              <div className="px-6 py-2 bg-elora-cream/60 border-b border-elora-border flex items-center gap-2 text-[11px] text-elora-gray">
                <ShieldCheck className="w-3.5 h-3.5 text-elora-taupe" />
                <span>Verified against certified clinical formulations & dermatological guidelines</span>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full bg-elora-forest text-elora-sand flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-lg px-4 py-3 text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-elora-charcoal text-elora-ivory ml-auto"
                          : "bg-elora-surface text-elora-charcoal border border-elora-border/70 shadow-sm"
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.content}</p>

                      {/* Recommended Products Cards */}
                      {msg.products && msg.products.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-elora-border/60 space-y-2">
                          <p className="text-[10px] uppercase tracking-luxury text-elora-taupe font-semibold">
                            Recommended Formulations
                          </p>
                          {msg.products.map((p) => (
                            <div
                              key={p.id}
                              className="flex items-center gap-3 p-2 bg-elora-ivory/60 border border-elora-border/50 rounded-sm"
                            >
                              <div className="relative w-12 h-14 bg-elora-cream rounded-sm overflow-hidden flex-shrink-0">
                                <Image
                                  src={p.imageUrl}
                                  alt={p.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/shop/${p.slug}`}
                                  onClick={() => setIsOpen(false)}
                                  className="font-editorial text-sm text-elora-charcoal hover:text-elora-taupe truncate block"
                                >
                                  {p.name}
                                </Link>
                                <p className="text-[11px] font-medium text-elora-charcoal">
                                  {formatPrice(p.price)}
                                </p>
                              </div>
                              <Link
                                href={`/shop/${p.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 bg-elora-charcoal text-elora-ivory hover:bg-elora-taupe rounded-sm transition-colors"
                                title="View details"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-full bg-elora-cream text-elora-charcoal border border-elora-border flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start items-center">
                    <div className="w-7 h-7 rounded-full bg-elora-forest text-elora-sand flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-elora-surface border border-elora-border px-4 py-2.5 rounded-lg text-xs text-elora-taupe flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-elora-taupe rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-elora-taupe rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-elora-taupe rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      <span className="ml-1 text-[11px]">Evaluating formulation active tiers...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Starter Prompts */}
              <div className="px-6 py-2.5 bg-elora-surface/60 border-t border-elora-border">
                <p className="text-[10px] uppercase tracking-wider text-elora-gray mb-1.5">
                  Suggested inquiries:
                </p>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {SUGGESTED_QUERIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSubmit(q)}
                      className="px-2.5 py-1 bg-elora-ivory hover:bg-elora-cream border border-elora-border text-[11px] text-elora-charcoal whitespace-nowrap rounded-sm transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="p-4 bg-elora-surface border-t border-elora-border flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask regarding ingredients, skin compatibility, or rituals..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 bg-elora-ivory border border-elora-border px-3.5 py-2.5 text-xs text-elora-charcoal placeholder:text-elora-gray/60 focus:outline-none focus:border-elora-taupe"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-2.5 bg-elora-forest text-elora-sand hover:bg-elora-taupe hover:text-white transition-colors disabled:opacity-50 rounded-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

