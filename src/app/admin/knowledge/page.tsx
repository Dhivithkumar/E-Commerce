import React from "react";
import prisma from "@/lib/prisma";
import AdminKnowledgeClient from "@/components/admin/AdminKnowledgeClient";

export const dynamic = "force-dynamic";

export default async function AdminKnowledgePage() {
  const documents = await prisma.knowledgeDocument.findMany({
    include: { chunks: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
  });

  return <AdminKnowledgeClient initialDocuments={documents} />;
}
