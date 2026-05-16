import executeQuery from "../../lib/db";
import { verifyPassword } from "../../lib/password";
import {
  createSessionToken,
  sessionCookieHeader,
} from "../../lib/session";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  }

  const email = req.body?.email?.trim()?.toLowerCase();
  const password = req.body?.password;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const rows = await executeQuery({
      query:
        "SELECT id, password_hash FROM users WHERE email = ? LIMIT 1",
      values: [email],
    });

    const user = rows[0];
    if (!user?.password_hash) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    if (!verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = createSessionToken(user.id);
    res.setHeader("Set-Cookie", sessionCookieHeader(token));
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Login failed." });
  }
}
