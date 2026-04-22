import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { listUserTokens, tokenWithCode } from "@/lib/tokens";
import TokenGrid from "@/app/dashboard/TokenGrid";

type DashboardProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardPage({ searchParams }: DashboardProps) {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/login");
  }

  const params = searchParams ? await searchParams : undefined;
  const errorParam = params?.error;
  const error = Array.isArray(errorParam) ? errorParam[0] : errorParam;

  const tokens = await listUserTokens(sessionUser.userId);
  const codeTokens = tokens.map((token) => tokenWithCode(token));

  return (
    <main className="page-wrap">
      <section className="card" style={{ marginBottom: "1rem" }}>
        <div className="header-row">
          <h1>Welcome, {sessionUser.email}</h1>
          <form action="/api/auth/logout" method="post">
            <button type="submit" className="secondary-btn">
              Log out
            </button>
          </form>
        </div>
        <p className="subtext">Your stored authenticator connections and live 6-digit codes.</p>

        {error ? <p className="error-banner">{decodeURIComponent(error)}</p> : null}

        <TokenGrid initialTokens={codeTokens} />
      </section>

      <section className="card">
        <h2>Add a 2FA connection</h2>
        <p className="subtext">
          Paste the base32 secret from your provider (for example GitHub, Google, AWS, etc.).
        </p>

        <form action="/api/tokens" method="post" className="form-stack">
          <div className="field-grid">
            <div className="field">
              <label htmlFor="label">Label</label>
              <input id="label" name="label" required maxLength={100} placeholder="GitHub" />
            </div>
            <div className="field">
              <label htmlFor="issuer">Issuer</label>
              <input id="issuer" name="issuer" maxLength={100} placeholder="GitHub" />
            </div>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="secret">Base32 Secret</label>
              <input
                id="secret"
                name="secret"
                required
                minLength={16}
                maxLength={256}
                placeholder="JBSWY3DPEHPK3PXP"
              />
            </div>
            <div className="field">
              <label htmlFor="algorithm">Algorithm</label>
              <select id="algorithm" name="algorithm" defaultValue="SHA1">
                <option value="SHA1">SHA1</option>
                <option value="SHA256">SHA256</option>
                <option value="SHA512">SHA512</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="digits">Digits</label>
              <select id="digits" name="digits" defaultValue="6">
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="period">Period (seconds)</label>
              <input id="period" name="period" type="number" min={15} max={120} defaultValue={30} />
            </div>
          </div>

          <button type="submit">Save token</button>
        </form>
      </section>
    </main>
  );
}
