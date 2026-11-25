// Plant rows with their images aggregated into the shape the frontend expects:
// { id, name, botanical_name, price, description, images: [{ src, pot_color }] }
export const PLANT_SELECT = `
  SELECT p.id, p.name, p.botanical_name, p.price::float8 AS price, p.description,
         COALESCE(
           json_agg(json_build_object('src', i.src, 'pot_color', i.pot_color) ORDER BY i.position)
             FILTER (WHERE i.id IS NOT NULL),
           '[]'
         ) AS images
  FROM plants p
  LEFT JOIN plant_images i ON i.plant_id = p.id`;
