// Database access shared by all API routes.
// In production this talks to Postgres on Neon over HTTP (DATABASE_URL is set by
// the Vercel ↔ Neon integration). The local dev server swaps in an embedded
// Postgres (PGlite) through setQueryRunner, so no account is needed to develop.
import { neon } from "@neondatabase/serverless";

let runner = null;

export const setQueryRunner = (fn) => {
  runner = fn;
};

const getRunner = () => {
  if (runner) return runner;
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const sql = neon(url);
  runner = (text, params) => sql.query(text, params);
  return runner;
};

/** Run one parameterised SQL statement and return the result rows. */
export const query = (text, params = []) => getRunner()(text, params);
