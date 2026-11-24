// GET /api/cart — the signed-in user's cart.
import { query } from "../_lib/db.js";
import { route } from "../_lib/http.js";

export default route(
  {
    GET: async (req, res, { user }) => {
      const items = await query(
        `SELECT c.id, c.plant_id, p.name AS plant_name, p.price::float8 AS price_per_unit,
                c.quantity, c.pot_color, i.src AS image_src
         FROM cart_items c
         JOIN plants p ON p.id = c.plant_id
         LEFT JOIN plant_images i ON i.plant_id = c.plant_id AND i.pot_color = c.pot_color
         WHERE c.user_id = $1
         ORDER BY c.created_at, c.id`,
        [user.id],
      );
      res.status(200).json(items);
    },
  },
  { auth: true },
);
