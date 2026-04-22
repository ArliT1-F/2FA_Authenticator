import { Secret, TOTP } from "otpauth";
import type { TotpAlgorithm } from "@prisma/client";

type TokenInput = {
  secret: string;
  label: string;
  issuer?: string | null;
  digits: number;
  period: number;
  algorithm: TotpAlgorithm;
};

type OtpAlgorithm = "SHA1" | "SHA256" | "SHA512";

const ALGORITHM_MAP: Record<TotpAlgorithm, OtpAlgorithm> = {
  SHA1: "SHA1",
  SHA256: "SHA256",
  SHA512: "SHA512",
};

export function normalizeBase32(secret: string): string {
  return secret.replace(/\s+/g, "").toUpperCase();
}

export function buildTotp(input: TokenInput): TOTP {
  return new TOTP({
    secret: Secret.fromBase32(normalizeBase32(input.secret)),
    label: input.label,
    issuer: input.issuer ?? undefined,
    digits: input.digits,
    period: input.period,
    algorithm: ALGORITHM_MAP[input.algorithm],
  });
}

export function codeAndRemaining(totp: TOTP, now = Date.now()) {
  const code = totp.generate({ timestamp: now });
  const periodMs = totp.period * 1000;
  const nextStepAt = Math.ceil(now / periodMs) * periodMs;

  return {
    code,
    remainingSeconds: Math.max(0, Math.ceil((nextStepAt - now) / 1000)),
  };
}

export function formatTokenCode(code: string): string {
  if (code.length === 6) {
    return `${code.slice(0, 3)} ${code.slice(3)}`;
  }
  return code;
}
