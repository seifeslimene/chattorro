import executeQuery from "../../lib/db";
import { getUserIdFromRequest } from "../../lib/session";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end();
  }

  const userId = getUserIdFromRequest(req.headers.cookie);
  if (!userId) {
    return res.status(200).json({ user: null });
  }

  try {
    const rows = await executeQuery({
      query:
        "SELECT id, email, firstname, lastname FROM users WHERE id = ? LIMIT 1",
      values: [userId],
    });
    const u = rows[0];
    if (!u) {
      return res.status(200).json({ user: null });
    }
    return res.status(200).json({ user: u });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Could not load session." });
  }
}
