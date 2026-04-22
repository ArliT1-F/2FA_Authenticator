import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createUser } from "@/lib/auth";
import { createSessionToken, setSessionCookie } from "@/lib/session";
import { firstIssueMessage, signupSchema } from "@/lib/validators";

function redirectWithError(path: string, message: string) {
  const url = new URL(path, "http://localhost");
  url.searchParams.set("error", message);
  return NextResponse.redirect(url.pathname + url.search, 302);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const parsed = signupSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      return redirectWithError("/signup", firstIssueMessage(parsed.error));
    }

    const user = await createUser(parsed.data.email, parsed.data.password);
    if (!user) {
      return redirectWithError("/signup", "An account with that email already exists.");
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
    });

    const cookieStore = await cookies();
    setSessionCookie(cookieStore, token);

    return NextResponse.redirect(new URL("/dashboard", request.url), 302);
  } catch {
    return redirectWithError("/signup", "Unable to create account right now.");
  }
}
