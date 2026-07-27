import { POT_COLORS } from "shared-components/util";
import { useState } from "react";
import * as cartService from "services/cart";
// import LoadingSpinner from "shared-components/LoadingSpinner";

const PlanPurchaseOption = ({ plant, imageIdx, setImageIdx }) => {
  const colors = plant.images.map((item, idx) => (
    <div
      key={item.pot_color}
      className="flex flex-col items-center mx-2"
      onMouseEnter={() => {
        setImageIdx(idx);
      }}
    >
      <div
        className={`${POT_COLORS[item.pot_color]} w-8 h-8 flex rounded-full  ${imageIdx === idx && "outline outline-offset-2 outline-slate-400 "}`}
      ></div>
      <div
        className={`${imageIdx === idx ? "text-slate-700" : "text-slate-500"} my-1 text-sm`}
      >
        {item.pot_color}
      </div>
    </div>
  ));
  const [count, setCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <div className="flex flex-col my-10">
        <div className="text-emerald-700 flex mx-2">
          <i className="text-2xl fa-solid fa-brush mr-2"></i>
          <div className="text-lg ">Pot Colors</div>
        </div>
        <div className="flex my-2 ">{colors}</div>
      </div>
      <div className="flex ">
        <div className="flex items-center text-xl border border-slate-700 rounded-3xl mx-3 px-3 py-2">
          <button
            onClick={() => {
              if (count > 1) {
                setCount(count - 1);
              }
            }}
          >
            -
          </button>
          <div className="mx-3 text-emerald-700">{count}</div>
          <button
            onClick={() => {
              setCount(count + 1);
            }}
          >
            +
          </button>
        </div>
        <button
          className="bg-emerald-700 rounded-3xl text-xl px-2 text-white w-48 hover:bg-emerald-800 hover:border-emerald-900 hover:border"
          onClick={async () => {
            setIsLoading(true);
            const response = await cartService.addPlantToCart({
              quantity: count,
              plantId: plant.id,
              potColor: plant.images[imageIdx].pot_color,
            });
            setIsLoading(false);
          }}
        >
          {isLoading ? (
            <i className="fa-solid fa-spinner animate-spin mr-2"></i>
          ) : (
            <i className="fa-solid fa-cart-plus mr-2 "></i>
          )}
          Add to cart
        </button>
      </div>
    </>
  );
};
export default PlanPurchaseOption;
