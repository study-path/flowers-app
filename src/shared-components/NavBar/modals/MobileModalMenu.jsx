import SessionContext from "contexts/SessionContext";
import { useContext } from "react";
import { motion } from "motion/react";

const MobileModalMenu = (props) => {
  const { onCartOpenClick } = props;
  const { username, signOut } = useContext(SessionContext);
  return (
    <motion.div
      className="bg-emerald-700 text-emerald-200 text-lg flex flex-col pt-12 pr-12 pb-8 items-start rounded-bl-lg shadow-md "
      animate={{ translateY: 0 }}
      initial={{ translateY: "-100%" }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-8 py-4">
        <i className="fa-regular fa-user mr-2 text-2xl"></i>
        {username}
      </div>
      <button
        className="px-8 py-4"
        onClick={() => {
          signOut();
        }}
      >
        <i className="fa-solid fa-arrow-right-from-bracket mr-2 text-2xl"></i>
        sign out
      </button>
      <button className="px-8 py-4" onClick={onCartOpenClick}>
        <i className="fa-solid fa-cart-shopping mr-2 text-2xl"></i>cart
      </button>
    </motion.div>
  );
};
export default MobileModalMenu;
