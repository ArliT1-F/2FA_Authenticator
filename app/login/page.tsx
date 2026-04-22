import Link from "next/link";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const errorParam = params?.error;
  const error = Array.isArray(errorParam) ? errorParam[0] : errorParam;

  return (
    <main className="page-wrap">
      <section className="card">
        <h1>Log in</h1>
        <p className="subtext">Access your stored 2FA connections.</p>

        {error ? <p className="error-banner">{decodeURIComponent(error)}</p> : null}

        <form action="/api/auth/login" method="post" className="form-stack">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit">Log in</button>
        </form>

        <p className="subtext" style={{ marginTop: "0.9rem" }}>
          Need an account? <Link href="/signup">Sign up</Link>
        </p>
      </section>
    </main>
  );
}
