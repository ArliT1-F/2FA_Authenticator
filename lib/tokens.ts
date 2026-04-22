import type { Token } from "@prisma/client";
import { db } from "@/lib/db";
import { decryptSecret, encryptSecret } from "@/lib/crypto";
import { buildTotp, codeAndRemaining, normalizeBase32 } from "@/lib/totp";

type CreateTokenInput = {
  userId: string;
  label: string;
  issuer?: string;
  secret: string;
  digits: number;
  period: number;
  algorithm: "SHA1" | "SHA256" | "SHA512";
};

export async function listUserTokens(userId: string): Promise<Token[]> {
  return db.token.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createUserToken(input: CreateTokenInput): Promise<Token> {
  return db.token.create({
    data: {
      userId: input.userId,
      label: input.label,
      issuer: input.issuer || null,
      secretEncrypted: encryptSecret(normalizeBase32(input.secret)),
      digits: input.digits,
      period: input.period,
      algorithm: input.algorithm,
    },
  });
}

export async function deleteUserToken(userId: string, tokenId: string) {
  return db.token.deleteMany({
    where: {
      id: tokenId,
      userId,
    },
  });
}

export function tokenWithCode(token: Token, now = Date.now()) {
  const secret = decryptSecret(token.secretEncrypted);
  const totp = buildTotp({
    secret,
    label: token.label,
    issuer: token.issuer,
    digits: token.digits,
    period: token.period,
    algorithm: token.algorithm,
  });

  const { code, remainingSeconds } = codeAndRemaining(totp, now);

  return {
    id: token.id,
    label: token.label,
    issuer: token.issuer,
    digits: token.digits,
    period: token.period,
    algorithm: token.algorithm,
    code,
    remainingSeconds,
  };
}
