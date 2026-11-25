// POST /api/users — create an account.
import bcrypt from "bcryptjs";
import { query } from "../_lib/db.js";
import { route } from "../_lib/http.js";

export default route({
  POST: async (req, res, { body }) => {
    const { username, password } = body;
    if (typeof username !== "string" || username.length < 4 || username.length > 30) {
      return res.status(400).json({ error: "username must be 4–30 characters" });
    }
    // bcrypt only uses the first 72 bytes of a password
    if (typeof password !== "string" || password.length < 4 || Buffer.byteLength(password) > 72) {
      return res.status(400).json({ error: "password must be 4–72 characters" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const rows = await query(
      `INSERT INTO users (username, password_hash) VALUES ($1, $2)
       ON CONFLICT (username) DO NOTHING
       RETURNING id, username`,
      [username, passwordHash],
    );
    if (rows.length === 0) return res.status(409).json({ error: "username already taken" });

    res.status(201).json(rows[0]);
  },
});
