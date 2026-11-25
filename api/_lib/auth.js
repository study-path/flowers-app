import { SignJWT, jwtVerify } from "jose";

const SESSION_LIFETIME = "7d";

const secret = () => {
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(value);
};

/** Sign a session token. The frontend reads `username` from it with jwt-decode. */
export const createSessionToken = (user) =>
  new SignJWT({ username: user.username })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(SESSION_LIFETIME)
    .sign(secret());

/** Return { id, username } from a valid `Authorization: Bearer <token>` header, else null. */
export const getUser = async (req) => {
  const match = /^Bearer (.+)$/.exec(req.headers.authorization ?? "");
  if (!match) return null;
  try {
    const { payload } = await jwtVerify(match[1], secret(), { algorithms: ["HS256"] });
    return { id: Number(payload.sub), username: payload.username };
  } catch {
    return null;
  }
};
