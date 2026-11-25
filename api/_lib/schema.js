import { query } from "./db.js";

// One statement per entry: Neon's HTTP driver runs a single statement per call.
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
     id            SERIAL PRIMARY KEY,
     username      TEXT NOT NULL UNIQUE,
     password_hash TEXT NOT NULL,
     created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE TABLE IF NOT EXISTS plants (
     id             SERIAL PRIMARY KEY,
     name           TEXT NOT NULL UNIQUE,
     botanical_name TEXT,
     price          NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
     description    TEXT NOT NULL DEFAULT ''
   )`,
  `CREATE TABLE IF NOT EXISTS plant_images (
     id        SERIAL PRIMARY KEY,
     plant_id  INTEGER NOT NULL REFERENCES plants (id) ON DELETE CASCADE,
     pot_color TEXT NOT NULL,
     src       TEXT NOT NULL,
     position  INTEGER NOT NULL DEFAULT 0,
     UNIQUE (plant_id, pot_color)
   )`,
  `CREATE TABLE IF NOT EXISTS cart_items (
     id         SERIAL PRIMARY KEY,
     user_id    INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
     plant_id   INTEGER NOT NULL REFERENCES plants (id) ON DELETE CASCADE,
     pot_color  TEXT NOT NULL,
     quantity   INTEGER NOT NULL CHECK (quantity > 0),
     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     UNIQUE (user_id, plant_id, pot_color)
   )`,
];

export const applySchema = async () => {
  for (const statement of SCHEMA) await query(statement);
};

/**
 * Make the catalog match data/plants.json. Safe to run repeatedly: plants are matched
 * by name, so existing ids (and carts that point at them) stay valid. Plants and pot
 * colors that are no longer in the file are removed, together with their cart items.
 */
export const seedPlants = async (plants) => {
  // never empty the shop because of a bad or missing file
  if (!Array.isArray(plants) || plants.length === 0) throw new Error("no plants to load");
  for (const plant of plants) {
    const [{ id }] = await query(
      `INSERT INTO plants (name, botanical_name, price, description)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (name) DO UPDATE
         SET botanical_name = EXCLUDED.botanical_name,
             price          = EXCLUDED.price,
             description    = EXCLUDED.description
       RETURNING id`,
      [plant.name, plant.botanical_name ?? null, plant.price, plant.description ?? ""],
    );
    for (const [position, image] of (plant.images ?? []).entries()) {
      await query(
        `INSERT INTO plant_images (plant_id, pot_color, src, position)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (plant_id, pot_color) DO UPDATE
           SET src = EXCLUDED.src, position = EXCLUDED.position`,
        [id, image.pot_color, image.src, position],
      );
    }
    await query(
      `DELETE FROM plant_images
       WHERE plant_id = $1
         AND pot_color NOT IN (SELECT jsonb_array_elements_text($2::jsonb))`,
      [id, JSON.stringify((plant.images ?? []).map((image) => image.pot_color))],
    );
  }

  await query(
    `DELETE FROM plants
     WHERE name NOT IN (SELECT jsonb_array_elements_text($1::jsonb))`,
    [JSON.stringify(plants.map((plant) => plant.name))],
  );
  await query(
    `DELETE FROM cart_items c
     WHERE NOT EXISTS (
       SELECT 1 FROM plant_images i
       WHERE i.plant_id = c.plant_id AND i.pot_color = c.pot_color
     )`,
  );
};
