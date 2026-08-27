import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAccessStatus } from "@/lib/subscription";

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/terms",
  "/privacy",
  "/admin/login",
];

// Rutas dentro del área autenticada que deben ser alcanzables aunque la suscripción
// haya vencido (para poder pagar) o que tienen su propia verificación de acceso (admin).
const SUBSCRIPTION_EXEMPT_PATHS = ["/billing", "/settings", "/admin"];

// El consentimiento legal es obligatorio para todos, pero no se revisa dentro de
// /onboarding (para no entrar en bucle) ni en rutas ya públicas/de admin.
const CONSENT_EXEMPT_PATHS = ["/onboarding", "/admin"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Las peticiones POST a rutas de página son invocaciones de Server Actions (React).
  // Cada action ya valida su propia sesión (requireUserId()/auth()) — si el middleware
  // también intercepta y llama a auth()/redirect() aquí, corrompe el protocolo interno
  // de Server Actions y Next responde "Failed to find Server Action".
  if (request.method !== "GET") {
    return NextResponse.next();
  }

  const session = await auth();

  if (!session?.user) {
    const loginPath = pathname.startsWith("/admin") ? "/admin/login" : "/login";
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  if (!CONSENT_EXEMPT_PATHS.some((p) => pathname.startsWith(p))) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { acceptedTermsAt: true },
    });
    if (!dbUser?.acceptedTermsAt) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  if (!SUBSCRIPTION_EXEMPT_PATHS.some((p) => pathname.startsWith(p))) {
    const access = await getAccessStatus(session.user.id);
    if (!access.allowed) {
      return NextResponse.redirect(new URL("/billing", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|ico)).*)"],
};
