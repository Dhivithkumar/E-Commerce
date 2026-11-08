import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN";
}

const SESSION_COOKIE_NAME = "elora_session_token";

// Safe session payload serializer
export function createSessionToken(user: SessionUser): string {
  const payload = {
    ...user,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.id || !parsed.exp || parsed.exp < Date.now()) {
      return null;
    }
    return {
      id: parsed.id,
      email: parsed.email,
      name: parsed.name,
      role: parsed.role,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = verifySessionToken(token);
  if (!session) return null;

  // Verify user still exists in database
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as "CUSTOMER" | "ADMIN",
  };
}

export { SESSION_COOKIE_NAME };

