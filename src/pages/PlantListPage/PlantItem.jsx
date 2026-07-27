import { useState } from "react";
import { Link } from "react-router-dom";
import { getRandomIdx, POT_COLORS } from "shared-components/util";
// const POT_COLORS = {
//   stone: "bg-stone-200",
//   slate: "bg-slate-300",
//   sky: "bg-sky-700",
//   black: "bg-gray-600",
//   white: "bg-gray-50",
//   amber: "bg-amber-600",
// };

// const getRandomIDx = (array) => {
//   return Math.floor(Math.random() * array.length);
// };
const PlantItem = (props) => {
  const { plant } = props;
  const [imageIdx, setImageIdx] = useState(() => getRandomIdx(plant.images));

  return (
    <div className="mx-5 my-8 border border-emerald-300 shadow-xl rounded-md ">
      <Link to={`/plants/${plant.id}`}>
        <img
          src={plant.images[imageIdx].src}
          className="w-[280px] h-[320px] rounded-t-md"
        />
      </Link>
      <div className="flex justify-between mx-2">
        <div className="text-xl font-playfair text-emerald-700">
          {plant.name}
        </div>
        <div className="text-lg text-emerald-600"> ${plant.price}</div>
      </div>
      <div className="flex justify-between items-center m-2">
        <div className=" text-slate-500">
          {plant.images[imageIdx].pot_color}
        </div>
        <div className="flex">
          {plant.images.map((image, idx) => (
            <div
              key={idx}
              className={`${POT_COLORS[image.pot_color]} rounded-full w-4 h-4 mx-1 border ${imageIdx === idx && "outline outline-offset-2 outline-slate-400 "} border-slate-300 `}
              onMouseEnter={() => {
                setImageIdx(idx);
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default PlantItem;
