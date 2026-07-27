import * as cartService from "services/cart";
const CartItem = ({ plant, fetchCart }) => {
  console.log(plant);
  return (
    <>
      <div className=" flex">
        <img src={plant.image_src} className="w-28 rounded-md"></img>
        <div className="flex flex-1 flex-col mx-2 ">
          <div className="flex justify-between  text-2xl">
            <div className=" text-emerald-700">{plant.plant_name}</div>
            <div className="">${plant.price_per_unit * plant.quantity}</div>
          </div>
          <div className="flex flex-col my-2">
            <div className="flex text-sm">
              <div className="w-14 text-slate-600"> color:</div>
              {plant.pot_color}
            </div>
            <div className="flex text-sm">
              <div className="w-14 text-slate-600">qty:</div>
              {plant.quantity}
            </div>
          </div>
          <div className="self-end ">
            <button
              onClick={async () => {
                await cartService.removeItemFromCart({
                  itemId: plant.id,
                });
                fetchCart();
              }}
            >
              <i className="fa-solid fa-trash text-slate-400 hover:text-red-600 active:bg-red-700"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartItem;
