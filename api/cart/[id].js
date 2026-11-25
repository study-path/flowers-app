// DELETE /api/cart/:id — remove one item from the signed-in user's cart.
import { query } from "../_lib/db.js";
import { route, toId } from "../_lib/http.js";

export default route(
  {
    DELETE: async (req, res, { user }) => {
      const id = toId(req.query.id);
      const rows = id
        ? await query("DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING id", [
            id,
            user.id,
          ])
        : [];
      if (rows.length === 0) return res.status(404).json({ error: "cart item not found" });
      res.status(200).json({ id });
    },
  },
  { auth: true },
);
