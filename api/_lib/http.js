import { getUser } from "./auth.js";

/**
 * Build a Vercel function from a map of HTTP method → handler.
 * Handlers get (req, res, ctx) where ctx.body is the parsed JSON body and,
 * when `auth: true`, ctx.user is the signed-in user ({ id, username }).
 */
export const route = (handlers, { auth = false } = {}) =>
  async (req, res) => {
    const handler = handlers[req.method];
    if (!handler) {
      res.setHeader("Allow", Object.keys(handlers).join(", "));
      return res.status(405).json({ error: "method not allowed" });
    }
    try {
      const ctx = { body: readBody(req) };
      if (auth) {
        ctx.user = await getUser(req);
        if (!ctx.user) return res.status(401).json({ error: "please sign in" });
      }
      await handler(req, res, ctx);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "something went wrong, please try again" });
    }
  };

const readBody = (req) => {
  try {
    const body = req.body;
    if (typeof body === "string") return body ? JSON.parse(body) : {};
    return body ?? {};
  } catch {
    return {};
  }
};

export const toId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};
