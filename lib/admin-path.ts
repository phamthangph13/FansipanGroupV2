/**
 * The public entry point for the administrator login is intentionally not
 * linked anywhere on the website. Set ADMIN_LOGIN_PATH to change it.
 */
export const DEFAULT_ADMIN_LOGIN_PATH = "quan-tri-v2";

export function adminLoginPath() {
  const raw = (process.env.ADMIN_LOGIN_PATH || DEFAULT_ADMIN_LOGIN_PATH).trim();
  const clean = raw.replace(/^\/+|\/+$/g, "").replace(/\s+/g, "-");
  return `/${clean || DEFAULT_ADMIN_LOGIN_PATH}`;
}

export function adminLoginSegments() {
  return adminLoginPath().split("/").filter(Boolean);
}
