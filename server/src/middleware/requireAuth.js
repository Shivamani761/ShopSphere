import { sessions, accounts } from "../data/store.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const email = sessions.get(token);
  const account = email ? accounts.get(email) : null;
  if (!account) return res.status(401).json({ success: false, message: "Please sign in to continue." });
  req.account = account;
  req.token = token;
  next();
}
