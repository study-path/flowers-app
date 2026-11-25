// GET /api/plants — the whole catalog.
import { query } from "../_lib/db.js";
import { route } from "../_lib/http.js";
import { PLANT_SELECT } from "../_lib/plants.js";

export default route({
  GET: async (req, res) => {
    const plants = await query(`${PLANT_SELECT} GROUP BY p.id ORDER BY p.id`);
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    res.status(200).json(plants);
  },
});
