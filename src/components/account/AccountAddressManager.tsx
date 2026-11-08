"use client";

import React, { useState } from "react";
import { MapPin, Plus, Check, X, ShieldCheck } from "lucide-react";

interface AddressItem {
  id: string;
  firstName: string;
  lastName: string;
  street: string;
  apartment?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string | null;
  isDefaultShipping: boolean;
}

export default function AccountAddressManager({
  initialAddresses,
}: {
  initialAddresses: AddressItem[];
}) {
  const [addresses, setAddresses] = useState<AddressItem[]>(initialAddresses);
  const [modalOpen, setModalOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("US");
  const [phone, setPhone] = useState("");
  const [isDefaultShipping, setIsDefaultShipping] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/account/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          street,
          apartment,
          city,
          state,
          postalCode,
          country,
          phone,
          isDefaultShipping,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to register address.");

      setAddresses([data.address, ...addresses]);
      setSuccess("New courier destination registered successfully.");
      setTimeout(() => {
        setModalOpen(false);
        setSuccess("");
        setStreet("");
        setApartment("");
        setCity("");
        setPostalCode("");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-elora-surface border border-elora-border p-6 rounded-sm shadow-card space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-elora-border/60">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-elora-taupe" />
          <h3 className="font-editorial text-xl text-elora-charcoal">
            Saved Delivery Destinations
          </h3>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="text-xs text-elora-taupe hover:text-elora-charcoal font-medium flex items-center gap-1 uppercase tracking-wider"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Address</span>
        </button>
      </div>

      <div className="space-y-3">
        {addresses.length === 0 ? (
          <p className="text-xs text-elora-gray">No destination addresses registered yet.</p>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-3.5 bg-elora-ivory/50 border border-elora-border/70 rounded-sm text-xs space-y-1 relative"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-elora-charcoal">
                  {addr.firstName} {addr.lastName}
                </p>
                {addr.isDefaultShipping && (
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-elora-forest/10 text-elora-forest rounded-sm">
                    Default Destination
                  </span>
                )}
              </div>
              <p className="text-elora-gray">
                {addr.street} {addr.apartment ? `• ${addr.apartment}` : ""}
              </p>
              <p className="text-elora-gray">
                {addr.city}, {addr.state} {addr.postalCode} • {addr.country}
              </p>
              {addr.phone && <p className="text-elora-gray">{addr.phone}</p>}
            </div>
          ))
        )}
      </div>

      {/* Add Address Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-elora-charcoal/50 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md bg-elora-ivory border border-elora-border shadow-luxury rounded-sm p-6 space-y-4 z-10">
            <div className="flex items-center justify-between pb-3 border-b border-elora-border">
              <h3 className="font-editorial text-xl text-elora-charcoal">
                Register Delivery Address
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-elora-charcoal">
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-elora-charcoal block mb-0.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-elora-surface border border-elora-border px-3 py-1.5 text-xs rounded-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-elora-charcoal block mb-0.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-elora-surface border border-elora-border px-3 py-1.5 text-xs rounded-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-elora-charcoal block mb-0.5">
                  Country / Territory
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-elora-surface border border-elora-border px-3 py-1.5 text-xs rounded-sm cursor-pointer"
                >
                  <option value="US">United States (USD)</option>
                  <option value="GB">United Kingdom (GBP)</option>
                  <option value="CA">Canada (CAD)</option>
                  <option value="AU">Australia (AUD)</option>
                  <option value="AE">United Arab Emirates (AED)</option>
                  <option value="FR">France (EUR)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-elora-charcoal block mb-0.5">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 740 Park Avenue"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-elora-surface border border-elora-border px-3 py-1.5 text-xs rounded-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-elora-charcoal block mb-0.5">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-elora-surface border border-elora-border px-3 py-1.5 text-xs rounded-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-elora-charcoal block mb-0.5">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-elora-surface border border-elora-border px-3 py-1.5 text-xs rounded-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-elora-charcoal block mb-0.5">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-elora-surface border border-elora-border px-3 py-1.5 text-xs rounded-sm"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 border border-elora-border uppercase text-[11px] rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 bg-elora-charcoal text-elora-ivory uppercase text-[11px] rounded-sm hover:bg-elora-taupe"
                >
                  {loading ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

