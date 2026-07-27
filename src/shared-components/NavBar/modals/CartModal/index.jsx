import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import * as cartService from "services/cart";
import LoadingSpinner from "shared-components/LoadingSpinner";
import CartItem from "./CartItem";
import { useContext } from "react";
import SessionContext from "contexts/SessionContext";

const CartModal = () => {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { username } = useContext(SessionContext);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    const response = await cartService.getCart();
    setPlants(await response.json());
    setIsLoading(false);
  }, []);

  let totalQuantity = 0;
  let subTotal = 0;
  for (let plant of plants) {
    totalQuantity += plant.quantity;
    subTotal += plant.quantity * plant.price_per_unit;
  }

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <motion.div
      className="bg-white h-screen w-full max-w-xl flex flex-col "
      initial={{ translateX: "100%" }}
      animate={{ translateX: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-emerald-800 text-white text-3xl font-playfair text-center py-4 shadow-md  flex justify-around">
        {username}&apos;s Cart
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex-1 overflow-y-scroll ">
          {plants.map((plant) => (
            <div className="border-b pb-2 border-slate-400 m-3" key={plant.id}>
              <CartItem plant={plant} fetchCart={fetchCart} />
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col px-3 pb-6 border-t border-slate-200 text-lg">
        <div className="flex justify-between  py-4">
          <div className="">{totalQuantity} items</div>
          <div>
            Subtotal:
            <span className="texl-lg font-bold text-slate-700 ml-2">
              ${subTotal}
            </span>
          </div>
        </div>
        <button
          className="bg-emerald-700 rounded-full text-xl flex justify-center items-center py-3 text-white text-large"
          onClick={() => alert("this app is not a real plant selling site :)")}
        >
          Checkout
          <i className="fa-solid fa-arrow-right-to-bracket ml-2"></i>
        </button>
      </div>
    </motion.div>
  );
};
export default CartModal;
