import executeQuery from "../../lib/db";
import { hashPassword } from "../../lib/password";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  }

  try {
    const body = req.body;
    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();
    const email = (body.email || body.emailAddress)?.trim()?.toLowerCase();
    const password = body.password;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        error:
          "First name, last name, email, and password are required.",
      });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters." });
    }

    const passwordHash = hashPassword(password);

    const existing = await executeQuery({
      query: "SELECT id FROM users WHERE email = ? LIMIT 1",
      values: [email],
    });

    if (existing.length > 0) {
      return res.status(409).json({
        error: "An account with this email already exists.",
      });
    }

    await executeQuery({
      query:
        "INSERT INTO users (firstname, lastname, email, password_hash) VALUES (?, ?, ?, ?)",
      values: [firstName, lastName, email, passwordHash],
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Could not create account." });
  }
}
