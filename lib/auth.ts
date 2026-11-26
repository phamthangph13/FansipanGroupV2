import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { collections, hashPassword, verifyPasswordHash } from "./db";

const COOKIE = "fsg_admin";
const MAX_AGE = 60 * 60 * 12;

function secret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "fansipan-dev-secret-change-me"
  );
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken() {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + MAX_AGE * 1000, scope: "admin", role: "admin" }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return data.scope === "admin" && typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function checkPassword(input: string): Promise<boolean> {
  if (!input) return false;
  try {
    const { admins } = await collections();
    const admin = await admins.findOne({ username: "admin", role: "admin" });
    const envPassword = process.env.ADMIN_PASSWORD || "";
    const envHash = envPassword
      ? crypto.createHash("sha256").update(envPassword).digest("hex")
      : undefined;

    if (envPassword && (!admin || admin.envHash !== envHash)) {
      await admins.updateOne(
        { username: "admin" },
        {
          $set: {
            username: "admin",
            role: "admin",
            passwordHash: hashPassword(envPassword),
            envHash,
            updatedAt: new Date().toISOString(),
          },
        },
        { upsert: true },
      );
      const a = crypto.createHash("sha256").update(input).digest();
      const b = crypto.createHash("sha256").update(envPassword).digest();
      return crypto.timingSafeEqual(a, b);
    }

    if (admin?.passwordHash) {
      return verifyPasswordHash(input, admin.passwordHash);
    }
  } catch {
    // Fall back to env check if DB check fails during early startup.
  }
  const expected =
    process.env.ADMIN_PASSWORD ||
    (process.env.NODE_ENV === "production" ? null : "fansipan2026");
  if (!expected) return false;
  const a = crypto.createHash("sha256").update(input).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

export async function updateAdminPassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: true } | { ok: false; error: "invalid-current" | "weak-password" }> {
  if (!(await checkPassword(currentPassword))) {
    return { ok: false, error: "invalid-current" };
  }
  if (newPassword.trim().length < 6) {
    return { ok: false, error: "weak-password" };
  }
  const { admins } = await collections();
  await admins.updateOne(
    { username: "admin" },
    {
      $set: {
        username: "admin",
        role: "admin",
        passwordHash: hashPassword(newPassword),
        updatedAt: new Date().toISOString(),
      },
    },
    { upsert: true },
  );
  return { ok: true };
}

export async function isAdmin() {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE)?.value);
}

export async function requireAdmin() {
  if (!(await isAdmin())) notFound();
}

export async function setSessionCookie() {
  const store = await cookies();
  store.set(COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE);
}

export const ADMIN_COOKIE = COOKIE;
