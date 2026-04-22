import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page-wrap">
      <section className="card">
        <h1>Authenticator Vault</h1>
        <p className="subtext">
          A Vercel-ready authenticator service. Users can sign up, log in, securely store TOTP
          secrets, and retrieve rotating 6-digit codes like Authy or Google Authenticator.
        </p>

        <div className="button-row">
          <Link className="button-link" href="/signup">
            Sign up
          </Link>
          <Link className="button-link secondary-btn" href="/login">
            Log in
          </Link>
          <Link className="button-link secondary-btn" href="/dashboard">
            Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
