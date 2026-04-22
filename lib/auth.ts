import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const SALT_ROUNDS = 12;

export async function createUser(email: string, password: string) {
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return null;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return db.user.create({
    data: {
      email,
      passwordHash,
    },
  });
}

export async function authenticateUser(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return null;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return null;
  }

  return user;
}
