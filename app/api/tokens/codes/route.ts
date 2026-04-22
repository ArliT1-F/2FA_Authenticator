import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getSessionUserFromCookieStore } from "@/lib/session";
import { listUserTokens, tokenWithCode } from "@/lib/tokens";

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
