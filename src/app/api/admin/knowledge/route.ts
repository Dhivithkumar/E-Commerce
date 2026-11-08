import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const documents = await prisma.knowledgeDocument.findMany({
      include: { chunks: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Admin knowledge fetch error:", error);
    return NextResponse.json({ message: "Failed to fetch knowledge documents." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category = "PRODUCT", content, tags } = body;

    if (!title || !content) {
      return NextResponse.json({ message: "Please supply title and content." }, { status: 400 });
    }

    const doc = await prisma.$transaction(async (tx) => {
      const created = await tx.knowledgeDocument.create({
        data: {
          title,
          category,
          content,
          tagsJson: JSON.stringify(tags || []),
          isActive: true,
        },
      });

      // Semantic paragraph chunking
      const paragraphs = content.split(/\n\s*\n/).filter((p: string) => p.trim().length > 10);
      const chunks = paragraphs.length > 0 ? paragraphs : [content];

      for (let i = 0; i < chunks.length; i++) {
        await tx.knowledgeChunk.create({
          data: {
            documentId: created.id,
            chunkIndex: i,
            content: chunks[i],
            metadataJson: JSON.stringify({ category, title, tags }),
          },
        });
      }

      return await tx.knowledgeDocument.findUnique({
        where: { id: created.id },
        include: { chunks: true },
      });
    });

    return NextResponse.json({ success: true, document: doc });
  } catch (error) {
    console.error("Ingest document error:", error);
    return NextResponse.json({ message: "Failed to ingest knowledge document." }, { status: 500 });
  }
}

