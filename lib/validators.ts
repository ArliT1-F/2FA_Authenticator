import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1, "Password is required."),
});

export const tokenSchema = z.object({
  label: z.string().trim().min(1, "Label is required.").max(100),
  issuer: z.string().trim().max(100).optional().default(""),
  secret: z
    .string()
    .trim()
    .min(16, "Secret appears too short.")
    .max(256)
    .regex(/^[A-Z2-7=\s]+$/i, "Secret must be a base32 string."),
  digits: z.coerce.number().int().min(6).max(8).default(6),
  period: z.coerce.number().int().min(15).max(120).default(30),
  algorithm: z.enum(["SHA1", "SHA256", "SHA512"]).default("SHA1"),
});

export function firstIssueMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Invalid input.";
}
