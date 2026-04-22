import Link from "next/link";

type SignupPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const errorParam = params?.error;
  const error = Array.isArray(errorParam) ? errorParam[0] : errorParam;

  return (
    <main className="page-wrap">
      <section className="card">
        <h1>Create account</h1>
        <p className="subtext">Sign up to start storing your authenticator tokens.</p>

        {error ? <p className="error-banner">{decodeURIComponent(error)}</p> : null}

        <form action="/api/auth/signup" method="post" className="form-stack">
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
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <button type="submit">Sign up</button>
        </form>

        <p className="subtext" style={{ marginTop: "0.9rem" }}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}
