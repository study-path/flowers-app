// Create the tables and load data/plants.json into your Neon database.
//
//   npm run db:seed
//
// DATABASE_URL is read from .env.local (copy the connection string from the Neon
// dashboard). Safe to run again. Plants that are no longer in the file are removed.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { query } from "../api/_lib/db.js";
import { applySchema, seedPlants } from "../api/_lib/schema.js";

const ROOT = path.resolve(import.meta.dirname, "..");
const plants = JSON.parse(await readFile(path.join(ROOT, "data", "plants.json"), "utf8"));

await applySchema();
await seedPlants(plants);

const [{ count }] = await query("SELECT count(*)::int AS count FROM plants");
console.log(`Schema ready. ${count} plants in the database.`);
