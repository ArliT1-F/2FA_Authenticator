import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createUserToken, listUserTokens, tokenWithCode } from "@/lib/tokens";
import { getSessionUserFromCookieStore } from "@/lib/session";
import { firstIssueMessage, tokenSchema } from "@/lib/validators";

export async function GET() {
  const cookieStore = await cookies();
  const user = await getSessionUserFromCookieStore(cookieStore);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tokens = await listUserTokens(user.userId);
  return NextResponse.json({
    tokens: tokens.map((token) => tokenWithCode(token)),
  });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const user = await getSessionUserFromCookieStore(cookieStore);

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url), 302);
  }

  try {
    const formData = await request.formData();
    const parsed = tokenSchema.safeParse({
      label: formData.get("label"),
      issuer: formData.get("issuer"),
      secret: formData.get("secret"),
      digits: formData.get("digits"),
      period: formData.get("period"),
      algorithm: formData.get("algorithm"),
    });

    if (!parsed.success) {
      const target = new URL("/dashboard", request.url);
      target.searchParams.set("error", firstIssueMessage(parsed.error));
      return NextResponse.redirect(target, 302);
    }

    await createUserToken({
      userId: user.userId,
      label: parsed.data.label,
      issuer: parsed.data.issuer,
      secret: parsed.data.secret,
      digits: parsed.data.digits,
      period: parsed.data.period,
      algorithm: parsed.data.algorithm,
    });

    return NextResponse.redirect(new URL("/dashboard", request.url), 302);
  } catch {
    const target = new URL("/dashboard", request.url);
    target.searchParams.set("error", "Failed to store token.");
    return NextResponse.redirect(target, 302);
  }
}
