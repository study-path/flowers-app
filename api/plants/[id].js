// GET /api/plants/:id — one plant.
import { query } from "../_lib/db.js";
import { route, toId } from "../_lib/http.js";
import { PLANT_SELECT } from "../_lib/plants.js";

export default route({
  GET: async (req, res) => {
    const id = toId(req.query.id);
    const [plant] = id ? await query(`${PLANT_SELECT} WHERE p.id = $1 GROUP BY p.id`, [id]) : [];
    if (!plant) return res.status(404).json({ error: "plant not found" });

    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    res.status(200).json(plant);
  },
});
