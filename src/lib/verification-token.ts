import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createVerificationToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  await prisma.token.create({
    data: {
      userId,
      purpose: "EMAIL_VERIFY",
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + VERIFY_TOKEN_TTL_MS),
    },
  });
  return token;
}

export function buildVerifyUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return `${baseUrl}/verify-email?token=${token}`;
}
