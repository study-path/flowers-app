// One-time export of the plant catalog from the react-formula course API.
// Run it while you still have course access:
//
//   node --env-file=.env scripts/export-data.mjs
//
// It reads VITE_API_BASE_URL and VITE_API_KEY from .env. If the API needs a
// signed-in user to list plants, also set COURSE_USERNAME and COURSE_PASSWORD
// (an account you created on the old site), e.g. in PowerShell:
//
//   $env:COURSE_USERNAME="me"; $env:COURSE_PASSWORD="secret"; node --env-file=.env scripts/export-data.mjs
//
// Output:
//   data/plants.json              – the catalog, with image paths rewritten to local files
//   public/images/plants/*        – every plant photo
//   public/images/*.png           – logos and the sign-in picture

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const { VITE_API_BASE_URL: BASE, VITE_API_KEY: KEY } = process.env;
if (!BASE || !KEY) {
  console.error("VITE_API_BASE_URL and VITE_API_KEY must be set (use --env-file=.env).");
  process.exit(1);
}

const ROOT = path.resolve(import.meta.dirname, "..");
const PLANT_IMG_DIR = path.join(ROOT, "public", "images", "plants");
const IMG_DIR = path.join(ROOT, "public", "images");

// remote file → local name used by the app (public/images/<name>)
const STATIC_ASSETS = {
  "https://static-task-assets.react-formula.com/capstone_sign_in_scene.png": "sign_in_scene.png",
  "https://static-task-assets.react-formula.com/capstone_logo_dark.png": "logo_dark.png",
  "https://static-task-assets.react-formula.com/capstone_logo_light.png": "logo_light.png",
};

let session = null;

const api = async (method, urlPath, body) => {
  const headers = { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };
  if (session) headers["Capstone-Session"] = session;
  const res = await fetch(BASE + urlPath, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  return { res, data };
};

const signIn = async () => {
  const { COURSE_USERNAME: username, COURSE_PASSWORD: password } = process.env;
  if (!username || !password) return false;
  const { res, data } = await api("POST", "/users/session", { username, password });
  if (res.status !== 201) throw new Error(`Sign-in failed: ${JSON.stringify(data)}`);
  session = data.capstone_session_token;
  console.log(`Signed in as ${username}`);
  return true;
};

const slug = (text) =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Name files by plant and pot color, e.g. "3-snake-plant-sky.png". Different plants can
// share a remote file name, so using that name alone could overwrite photos.
const plantImageName = (plant, index, img) => {
  const ext = path.extname(new URL(img.src, BASE).pathname).toLowerCase() || ".png";
  return `${[slug(plant.id), slug(plant.name), slug(img.pot_color) || index].join("-")}${ext}`;
};

const written = new Set();

const download = async (url, dir, name) => {
  const res = await fetch(new URL(url, BASE));
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${url}`);
  const type = res.headers.get("content-type") ?? "";
  if (type && !/^image\/|octet-stream/.test(type)) {
    throw new Error(`Expected an image but got "${type}": ${url}`);
  }
  const key = path.join(dir, name).toLowerCase();
  if (written.has(key)) {
    throw new Error(`Two images would be saved as ${name}; stopped before overwriting.`);
  }
  written.add(key);
  await writeFile(path.join(dir, name), Buffer.from(await res.arrayBuffer()));
  return name;
};

const main = async () => {
  await mkdir(PLANT_IMG_DIR, { recursive: true });
  await mkdir(path.join(ROOT, "data"), { recursive: true });

  let list = await api("GET", "/plants");
  if (!Array.isArray(list.data)) {
    console.log(`GET /plants returned ${list.res.status}; trying with a signed-in user…`);
    if (!(await signIn())) {
      console.error("The API needs a user. Set COURSE_USERNAME and COURSE_PASSWORD and run again.");
      process.exit(1);
    }
    list = await api("GET", "/plants");
    if (!Array.isArray(list.data)) throw new Error(`GET /plants failed: ${JSON.stringify(list.data)}`);
  }
  console.log(`Found ${list.data.length} plants`);

  const plants = [];
  for (const summary of list.data) {
    // The detail endpoint may carry fields (description, botanical name) the list omits.
    const { res: detailRes, data: detail } = await api("GET", `/plants/${summary.id}`);
    if (!detailRes.ok || !detail) {
      throw new Error(`GET /plants/${summary.id} failed with status ${detailRes.status}`);
    }
    const plant = { ...summary, ...detail };

    const images = [];
    for (const [index, img] of (plant.images ?? []).entries()) {
      const file = await download(img.src, PLANT_IMG_DIR, plantImageName(plant, index, img));
      images.push({ ...img, src: `/images/plants/${file}` });
    }
    plants.push({
      id: plant.id,
      name: plant.name,
      botanical_name: plant.botanical_name ?? null,
      price: plant.price,
      description: plant.description ?? "",
      images,
      // keep anything else the API returned, so no data is lost
      extra: Object.fromEntries(
        Object.entries(plant).filter(
          ([k]) => !["id", "name", "botanical_name", "price", "description", "images"].includes(k),
        ),
      ),
    });
    console.log(`  ✓ ${plant.name} (${images.length} images)`);
  }

  await writeFile(path.join(ROOT, "data", "plants.json"), JSON.stringify(plants, null, 2) + "\n");

  for (const [url, name] of Object.entries(STATIC_ASSETS)) {
    const file = await download(url, IMG_DIR, name);
    console.log(`  ✓ ${file}`);
  }

  console.log("\nDone. Commit data/plants.json and public/images/ to git.");
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
