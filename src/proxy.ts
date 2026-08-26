import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getAccessStatus } from "@/lib/subscription";

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password", "/reset-password", "/terms", "/privacy"];

// Rutas dentro del área autenticada que deben ser alcanzables aunque la suscripción
// haya vencido (para poder pagar) o que tienen su propia verificación de acceso (admin).
const SUBSCRIPTION_EXEMPT_PATHS = ["/billing", "/settings", "/admin"];

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

  const session = await auth();

  if (!session?.user) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
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
