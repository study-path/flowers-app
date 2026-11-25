// Local API server for development: runs the same handlers as the /api Vercel
// Functions, backed by an embedded Postgres (PGlite) stored in .local-db/.
// No Neon account or Vercel CLI needed.
//
//   npm run dev:api      (in one terminal)
//   npm run dev          (in another — Vite proxies /api to this server)
//
// LOCAL_DB=memory keeps the database in memory (fresh on every start).
// PLANTS_JSON=<path> seeds from another file instead of data/plants.json.
import http from "node:http";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { setQueryRunner } from "../api/_lib/db.js";
import { applySchema, seedPlants } from "../api/_lib/schema.js";

const ROOT = path.resolve(import.meta.dirname, "..");
const PORT = Number(process.env.API_PORT ?? 3001);
process.env.JWT_SECRET ??= "local-dev-secret-do-not-use-in-production";

// Stop early if another copy is running: two copies must not open the same database.
await new Promise((resolve) => {
  const probe = http.createServer();
  probe.once("error", (err) => {
    console.error(
      err.code === "EADDRINUSE"
        ? `Port ${PORT} is already in use. The API is probably running in another terminal — stop it there with Ctrl+C, then try again.`
        : err.message,
    );
    process.exit(1);
  });
  probe.listen(PORT, () => probe.close(resolve));
});

// --- database -------------------------------------------------------------
const db =
  process.env.LOCAL_DB === "memory" ? new PGlite() : new PGlite(path.join(ROOT, ".local-db"));
setQueryRunner(async (text, params) => (await db.query(text, params)).rows);
await applySchema();

const plantsFile = process.env.PLANTS_JSON ?? path.join(ROOT, "data", "plants.json");
if (existsSync(plantsFile)) {
  const plants = JSON.parse(await readFile(plantsFile, "utf8"));
  await seedPlants(plants);
  console.log(`Seeded ${plants.length} plants from ${path.relative(ROOT, plantsFile)}`);
} else {
  console.warn(`No ${path.relative(ROOT, plantsFile)} found — the catalog will be empty.`);
}

// --- routing (mirrors Vercel's file-based routes in /api) ------------------
const ROUTES = [
  [/^\/api\/users$/, "users/index.js", []],
  [/^\/api\/users\/session$/, "users/session.js", []],
  [/^\/api\/plants$/, "plants/index.js", []],
  [/^\/api\/plants\/([^/]+)$/, "plants/[id].js", ["id"]],
  [/^\/api\/cart$/, "cart/index.js", []],
  [/^\/api\/cart\/plants\/([^/]+)$/, "cart/plants/[plantId].js", ["plantId"]],
  [/^\/api\/cart\/([^/]+)$/, "cart/[id].js", ["id"]],
];

const load = (file) => import(pathToFileURL(path.join(ROOT, "api", file))).then((m) => m.default);

const readRawBody = (req) =>
  new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const match = ROUTES.map(([re, file, names]) => [re.exec(url.pathname), file, names]).find(
    ([m]) => m,
  );

  // Vercel-style helpers
  res.status = (code) => ((res.statusCode = code), res);
  res.json = (data) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  };

  if (!match) return res.status(404).json({ error: "not found" });
  const [m, file, names] = match;
  req.query = Object.fromEntries(url.searchParams);
  names.forEach((name, i) => (req.query[name] = decodeURIComponent(m[i + 1])));
  const raw = await readRawBody(req);
  req.body = req.headers["content-type"]?.includes("application/json") && raw ? raw : undefined;

  const handler = await load(file);
  await handler(req, res);
  console.log(`${req.method} ${url.pathname} → ${res.statusCode}`);
});

server.listen(PORT, () => console.log(`API ready at http://localhost:${PORT}/api`));
