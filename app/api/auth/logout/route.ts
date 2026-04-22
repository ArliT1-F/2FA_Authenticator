import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { clearSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  clearSessionCookie(cookieStore);
  return NextResponse.redirect(new URL("/", request.url), 302);
}
