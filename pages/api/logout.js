import { clearSessionCookieHeader } from "../../lib/session";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  }
  res.setHeader("Set-Cookie", clearSessionCookieHeader());
  return res.status(200).json({ success: true });
}
