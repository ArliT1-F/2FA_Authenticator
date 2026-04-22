# 2FA Authenticator Web Service

A Vercel-ready web authenticator service where users can:

- Sign up / log in / log out
- Store private TOTP (2FA) token connections
- Receive rotating 6-digit codes that refresh on schedule

This behaves similarly to Authy or Google Authenticator, but as your own hosted web app.

## Stack

- Next.js (App Router)
- Prisma + PostgreSQL
- Cookie-based JWT session auth
- AES-256-GCM encrypted storage for TOTP secrets
- OTPAuth for code generation

## Environment variables

Copy `.env.example` to `.env` and update values:

- `DATABASE_URL`: Postgres connection string
- `AUTH_SECRET`: long random secret used to sign session JWTs
- `ENCRYPTION_KEY`: base64-encoded 32-byte key for encrypting TOTP secrets at rest

Generate encryption key:

```bash
openssl rand -base64 32
```

## Local development

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repo into Vercel.
3. Set the environment variables in Vercel Project Settings:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `ENCRYPTION_KEY`
4. Ensure your Postgres database is reachable from Vercel.
5. Deploy.

Vercel runs `npm install` and `npm run build` automatically.

## Security notes

- Passwords are hashed using bcrypt.
- Session tokens are HTTP-only cookies.
- TOTP shared secrets are encrypted before storing in the DB.
- This is a starter implementation; for production hardening, add rate limiting, CSRF protection, audit logging, and optional MFA for dashboard login.
