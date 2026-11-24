// POST /api/cart/plants/:plantId — add a plant in a pot color to the cart.
// Adding the same plant + color again increases the quantity of the existing line.
import { query } from "../../_lib/db.js";
import { route, toId } from "../../_lib/http.js";

export default route(
  {
    POST: async (req, res, { user, body }) => {
      const plantId = toId(req.query.plantId);
      const { quantity, pot_color: potColor } = body;
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return res.status(400).json({ error: "quantity must be a whole number from 1 to 99" });
      }

      const [option] = plantId
        ? await query("SELECT 1 FROM plant_images WHERE plant_id = $1 AND pot_color = $2", [
            plantId,
            potColor,
          ])
        : [];
      if (!option) return res.status(404).json({ error: "plant or pot color not found" });

      const [item] = await query(
        `INSERT INTO cart_items (user_id, plant_id, pot_color, quantity)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, plant_id, pot_color) DO UPDATE
           SET quantity = LEAST(cart_items.quantity + EXCLUDED.quantity, 99)
         RETURNING id, quantity`,
        [user.id, plantId, potColor, quantity],
      );
      res.status(201).json(item);
    },
  },
  { auth: true },
);
