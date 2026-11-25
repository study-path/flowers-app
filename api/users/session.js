// POST /api/users/session — sign in and get a session token.
import bcrypt from "bcryptjs";
import { query } from "../_lib/db.js";
import { route } from "../_lib/http.js";
import { createSessionToken } from "../_lib/auth.js";

// Compared against when the username does not exist, so a wrong username takes
// as long as a wrong password and response time doesn't reveal which accounts exist.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

export default route({
  POST: async (req, res, { body }) => {
    const { username, password } = body;
    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "username and password are required" });
    }

    const [user] = await query(
      "SELECT id, username, password_hash FROM users WHERE username = $1",
      [username],
    );
    const valid = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);
    if (!user || !valid) return res.status(401).json({ error: "invalid username or password" });

    res.status(201).json({ session_token: await createSessionToken(user) });
  },
});
