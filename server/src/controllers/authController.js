import { randomBytes, pbkdf2Sync, timingSafeEqual } from "node:crypto";
import { accounts, sessions } from "../data/store.js";

const makeHash = password => {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return { salt, hash };
};
const verifyPassword = (password, salt, expected) => {
  const actual = pbkdf2Sync(password, salt, 120000, 64, "sha512");
  const target = Buffer.from(expected, "hex");
  return actual.length === target.length && timingSafeEqual(actual, target);
};
const publicAccount = account => ({ name: account.name, email: account.email });

export function signUp(req, res) {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (name.length < 2) return res.status(400).json({ success: false, message: "Please enter a name with at least 2 characters." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, message: "Enter a valid email address." });
  if (password.length < 8) return res.status(400).json({ success: false, message: "Password must contain at least 8 characters." });
  if (accounts.has(email)) return res.status(409).json({ success: false, message: "An account with this email already exists. Please sign in." });

  const { salt, hash } = makeHash(password);
  const account = { name, email, salt, passwordHash: hash };
  accounts.set(email, account);
  const token = randomBytes(32).toString("hex");
  sessions.set(token, email);
  res.status(201).json({ success: true, token, account: publicAccount(account) });
}

export function signIn(req, res) {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const account = accounts.get(email);
  if (!account || !verifyPassword(password, account.salt, account.passwordHash)) {
    return res.status(401).json({ success: false, message: "Email or password is incorrect." });
  }
  const token = randomBytes(32).toString("hex");
  sessions.set(token, email);
  res.json({ success: true, token, account: publicAccount(account) });
}

export function signOut(req, res) {
  sessions.delete(req.token);
  res.json({ success: true, message: "Signed out successfully." });
}
