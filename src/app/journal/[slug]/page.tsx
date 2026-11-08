import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, User, Share2 } from "lucide-react";
import prisma from "@/lib/prisma";

interface ArticlePageProps {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: ArticlePageProps) {
  const article = await prisma.journalArticle.findUnique({
    where: { slug: params.slug },
  });
  if (!article) return { title: "Article Not Found | ÉLORA Journal" };
  return {
    title: `${article.title} | ÉLORA Clinical Journal`,
    description: article.excerpt,
  };
}

export default async function JournalArticlePage({ params }: ArticlePageProps) {
  const article = await prisma.journalArticle.findUnique({
    where: { slug: params.slug },
  });

  if (!article || !article.isPublished) {
    notFound();
  }

  return (
    <article className="bg-elora-ivory min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-elora-taupe hover:text-elora-charcoal transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Journal</span>
        </Link>

        {/* Title & Metadata */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs text-elora-gray uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-elora-taupe" />
              <span>{article.readTime}</span>
            </span>
            <span>•</span>
            <span className="text-elora-forest font-medium">{article.author}</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-elora-charcoal font-normal leading-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-elora-gray font-serif italic border-l-2 border-elora-taupe pl-4">
            &ldquo;{article.excerpt}&rdquo;
          </p>
        </div>

        {/* Cover Image */}
        <div className="relative aspect-[16/9] bg-elora-cream rounded-sm overflow-hidden shadow-luxury border border-elora-border">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="prose prose-stone text-xs sm:text-sm text-elora-gray font-sans leading-relaxed space-y-6 pt-4 whitespace-pre-line">
          {article.content}
        </div>

        {/* Footer Author & Related CTA */}
        <div className="pt-10 border-t border-elora-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-elora-gray">
            <p className="font-semibold text-elora-charcoal">{article.author}</p>
            <p>ÉLORA Formulation Chemistry Atelier</p>
          </div>

          <Link
            href="/shop"
            className="px-6 py-2.5 bg-elora-charcoal text-elora-ivory text-xs uppercase tracking-luxury hover:bg-elora-taupe transition-colors rounded-sm font-medium"
          >
            Explore Formulations Mentioned &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}

