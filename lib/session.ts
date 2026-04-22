import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { isProduction, requiredEnv } from "@/lib/env";

export const SESSION_COOKIE_NAME = "auth_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

const encoder = new TextEncoder();

export type SessionUser = {
  userId: string;
  email: string;
};

type CookieStore = Awaited<ReturnType<typeof cookies>>;

function sessionCookieConfig() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction(),
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  };
}

async function jwtSecret(): Promise<Uint8Array> {
  return encoder.encode(requiredEnv("AUTH_SECRET"));
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  const secret = await jwtSecret();

  return new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secret);
}

export async function decodeSessionToken(token: string): Promise<SessionUser | null> {
  try {
    const secret = await jwtSecret();
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      return null;
    }

    return {
      userId: payload.sub,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

export function setSessionCookie(cookieStore: CookieStore, token: string) {
  cookieStore.set(SESSION_COOKIE_NAME, token, sessionCookieConfig());
}

export function clearSessionCookie(cookieStore: CookieStore) {
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    ...sessionCookieConfig(),
    maxAge: 0,
  });
}

export async function getSessionUserFromCookieStore(
  cookieStore: CookieStore,
): Promise<SessionUser | null> {
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return decodeSessionToken(token);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  return getSessionUserFromCookieStore(cookieStore);
}
