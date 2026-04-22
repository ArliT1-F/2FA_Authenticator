import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { authenticateUser } from "@/lib/auth";
import { createSessionToken, setSessionCookie } from "@/lib/session";
import { firstIssueMessage, loginSchema } from "@/lib/validators";

function redirectWithError(path: string, message: string) {
  const url = new URL(path, "http://localhost");
  url.searchParams.set("error", message);
  return NextResponse.redirect(url.pathname + url.search, 302);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      return redirectWithError("/login", firstIssueMessage(parsed.error));
    }

    const user = await authenticateUser(parsed.data.email, parsed.data.password);
    if (!user) {
      return redirectWithError("/login", "Invalid email or password.");
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
    });

    const cookieStore = await cookies();
    setSessionCookie(cookieStore, token);

    return NextResponse.redirect(new URL("/dashboard", request.url), 302);
  } catch {
    return redirectWithError("/login", "Unable to log in right now.");
  }
}
