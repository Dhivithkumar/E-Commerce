"use client";

import React, { useState } from "react";
import { BookOpen, CheckCircle2, FileText, Plus, X, Check } from "lucide-react";

interface DocumentItem {
  id: string;
  title: string;
  category: string;
  content: string;
  chunks: { id: string }[];
}

export default function AdminKnowledgeClient({
  initialDocuments,
}: {
  initialDocuments: DocumentItem[];
}) {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("PRODUCT");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
      const res = await fetch("/api/admin/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          content,
          tags: tagList,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to ingest document.");

      setDocuments([data.document, ...documents]);
      setSuccess(`Document "${data.document.title}" ingested & chunked successfully.`);
      setTimeout(() => {
        setModalOpen(false);
        setSuccess("");
        setTitle("");
        setContent("");
        setTags("");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-elora-border gap-4">
        <div>
          <span className="text-xs uppercase tracking-ultra text-elora-taupe font-medium">
            Cognitive Intelligence
          </span>
          <h1 className="font-editorial text-3xl text-elora-charcoal mt-0.5">
            RAG Knowledge Center & Ingestion Pipeline
          </h1>
          <p className="text-xs text-elora-gray">
            Verified ground-truth documents retrieved by the AI Skincare Concierge
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-elora-forest text-elora-sand hover:bg-elora-taupe hover:text-white text-xs uppercase tracking-luxury font-medium rounded-sm transition-colors flex items-center gap-1.5 shadow-sm h-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Ingest Document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-elora-surface border border-elora-border rounded-sm shadow-sm">
          <p className="text-[10px] uppercase tracking-ultra text-elora-gray">Active Ingested Docs</p>
          <h3 className="font-editorial text-3xl text-elora-charcoal font-medium mt-1">
            {documents.length}
          </h3>
          <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Synchronized with AI Runtime</span>
          </p>
        </div>

        <div className="p-5 bg-elora-surface border border-elora-border rounded-sm shadow-sm">
          <p className="text-[10px] uppercase tracking-ultra text-elora-gray">Knowledge Chunks</p>
          <h3 className="font-editorial text-3xl text-elora-charcoal font-medium mt-1">
            {documents.reduce((acc, d) => acc + d.chunks.length, 0)}
          </h3>
          <p className="text-[11px] text-elora-gray mt-1">Semantic chunk boundaries</p>
        </div>

        <div className="p-5 bg-elora-surface border border-elora-border rounded-sm shadow-sm">
          <p className="text-[10px] uppercase tracking-ultra text-elora-gray">Ground Truth Model</p>
          <h3 className="font-editorial text-2xl text-elora-charcoal font-medium mt-1">
            RAG + Strict Retrieval
          </h3>
          <p className="text-[11px] text-elora-taupe mt-1">Zero Hallucination Tolerance</p>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-elora-surface border border-elora-border rounded-sm shadow-sm overflow-hidden">
        <div className="p-4 border-b border-elora-border/60 flex items-center justify-between">
          <h3 className="font-editorial text-xl text-elora-charcoal">
            Ingested Knowledge Documents
          </h3>
          <span className="text-xs text-elora-gray">{documents.length} Records</span>
        </div>

        <div className="divide-y divide-elora-border/60">
          {documents.map((doc) => (
            <div key={doc.id} className="p-6 space-y-2 hover:bg-elora-cream/20 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase px-2 py-0.5 bg-elora-forest/10 text-elora-forest font-semibold rounded-sm">
                    {doc.category}
                  </span>
                  <h4 className="font-editorial text-xl text-elora-charcoal font-medium">
                    {doc.title}
                  </h4>
                </div>
                <span className="text-[11px] text-elora-gray">
                  {doc.chunks.length} Semantic Chunk(s)
                </span>
              </div>
              <p className="text-xs text-elora-gray leading-relaxed font-sans">{doc.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ingest Document Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-elora-charcoal/50 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg bg-elora-ivory border border-elora-border shadow-luxury rounded-sm p-6 sm:p-8 space-y-6 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-elora-border">
              <div>
                <span className="text-[10px] uppercase tracking-ultra text-elora-taupe font-medium">
                  RAG Pipeline Ingestion
                </span>
                <h3 className="font-editorial text-2xl text-elora-charcoal">
                  Ingest Ground Truth Document
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1 text-elora-charcoal hover:text-elora-taupe">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleIngest} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ceramide 3:1:1 Clinical Dossier"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-elora-surface border border-elora-border px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-elora-taupe"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                    Knowledge Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-elora-surface border border-elora-border px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-elora-taupe cursor-pointer"
                  >
                    <option value="PRODUCT">PRODUCT</option>
                    <option value="INGREDIENT">INGREDIENT</option>
                    <option value="BRAND">BRAND</option>
                    <option value="POLICY">POLICY</option>
                    <option value="FAQ">FAQ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                  Semantic Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ceramides, barrier, lipids, clinical"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-elora-surface border border-elora-border px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-elora-taupe"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-elora-charcoal block mb-1">
                  Ground Truth Content (will be chunked automatically)
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Enter full verified text, clinical studies, or policy descriptions..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-elora-surface border border-elora-border px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-elora-taupe"
                />
              </div>

              <div className="pt-4 border-t border-elora-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-elora-border text-elora-charcoal uppercase tracking-wider text-xs rounded-sm hover:bg-elora-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-elora-forest text-elora-sand hover:bg-elora-taupe hover:text-white uppercase tracking-luxury text-xs font-medium rounded-sm shadow-sm transition-colors disabled:opacity-50"
                >
                  {loading ? "Ingesting..." : "Ingest & Chunk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

