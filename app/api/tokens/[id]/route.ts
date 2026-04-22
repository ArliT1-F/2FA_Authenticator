import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { deleteUserToken } from "@/lib/tokens";
import { getSessionUserFromCookieStore } from "@/lib/session";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const cookieStore = await cookies();
  const user = await getSessionUserFromCookieStore(cookieStore);

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url), 302);
  }

  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === "delete") {
    const { id } = await params;
    await deleteUserToken(user.userId, id);
  }

  return NextResponse.redirect(new URL("/dashboard", request.url), 302);
}
