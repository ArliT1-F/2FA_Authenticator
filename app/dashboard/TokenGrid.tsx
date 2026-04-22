"use client";

import { useEffect, useMemo, useState } from "react";
import { formatTokenCode } from "@/lib/totp";

type TokenCode = {
  id: string;
  label: string;
  issuer: string | null;
  code: string;
  remainingSeconds: number;
  digits: number;
  period: number;
  algorithm: string;
};

type Props = {
  initialTokens: TokenCode[];
};

export default function TokenGrid({ initialTokens }: Props) {
  const [tokens, setTokens] = useState(initialTokens);

  const hasTokens = tokens.length > 0;

  async function refreshCodes() {
    try {
      const response = await fetch("/api/tokens/codes", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as { tokens?: TokenCode[] };
      if (Array.isArray(data.tokens)) {
        setTokens(data.tokens);
      }
    } catch {
      // Ignore transient fetch errors. Next interval retries.
    }
  }

  useEffect(() => {
    if (!hasTokens) {
      return;
    }

    const timer = window.setInterval(() => {
      let shouldRefresh = false;

      setTokens((current) =>
        current.map((token) => {
          const remaining = token.remainingSeconds - 1;
          if (remaining <= 0) {
            shouldRefresh = true;
          }

          return {
            ...token,
            remainingSeconds: Math.max(0, remaining),
          };
        }),
      );

      if (shouldRefresh) {
        void refreshCodes();
      }
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [hasTokens]);

  const tokenCards = useMemo(
    () =>
      tokens.map((token) => (
        <article key={token.id} className="token-card">
          <h3>{token.label}</h3>
          <p className="issuer">{token.issuer ?? "No issuer"}</p>
          <p className="code">{formatTokenCode(token.code)}</p>
          <p className="refresh">Refreshes in {token.remainingSeconds}s</p>

          <form action={`/api/tokens/${token.id}`} method="post" style={{ marginTop: "0.65rem" }}>
            <input type="hidden" name="_action" value="delete" />
            <button type="submit" className="danger-btn">
              Delete
            </button>
          </form>
        </article>
      )),
    [tokens],
  );

  if (!hasTokens) {
    return <p className="empty-state">No tokens saved yet. Add your first connection below.</p>;
  }

  return <div className="token-grid">{tokenCards}</div>;
}
