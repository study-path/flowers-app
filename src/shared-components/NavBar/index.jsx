import SessionContext from "contexts/SessionContext";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import CartModal from "./modals/CartModal";

import ModalWrapper from "./modals/ModalWrapper";
import MobileModalMenu from "./modals/MobileModalMenu";

const NavBar = () => {
  const { username, signOut } = useContext(SessionContext);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <>
      <nav
        className="bg-emerald-700  flex justify-center font-lato"
        onMouseLeave={() => setUserMenuOpen(false)}
      >
        <div className="w-full max-w-5xl flex items-center justify-between px-8 py-2">
          <Link to="/plants">
            <div className="font-playfair text-white text-2xl flex flex-col items-center">
              <img
                src="https://static-task-assets.react-formula.com/capstone_logo_light.png"
                className="w-10"
              />
              Home plants
            </div>
          </Link>
          <div className=" justify-end border-red-500 border-3  hidden sm:flex">
            <div className="relative min-w-24">
              <button
                className="flex items-center text-emerald-200"
                onClick={() => {
                  setUserMenuOpen(true);
                }}
              >
                <i className="fa-regular fa-user mr-2 text-xl"></i>
                {username}
              </button>
              {userMenuOpen && (
                <div className="bottom-[-40px]  left-0  border-red-500 border-3 bg-white rounded-lg shadow-md ">
                  <button
                    className="text-slate-500 hover:text-emerald-700 "
                    onClick={() => {
                      signOut();
                    }}
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket mr-2 "></i>
                    sign out
                  </button>
                </div>
              )}
            </div>
            <button
              className="text-emerald-200 flex items-center"
              onClick={() => {
                setCartOpen(true);
              }}
            >
              <i className="fa-solid fa-cart-shopping mr-2 text-xl"></i>
            </button>
          </div>
          <button
            className="flex sm:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <i className="fa-solid fa-bars text-emerald-400"></i>
          </button>
        </div>
      </nav>

      <ModalWrapper
        isOpen={cartOpen}
        onCloseClick={() => {
          setCartOpen(false);
        }}
      >
        <CartModal cartOpen={cartOpen} setCartOpen={setCartOpen} />
      </ModalWrapper>

      <ModalWrapper
        isOpen={mobileMenuOpen}
        onCloseClick={() => {
          setMobileMenuOpen(false);
        }}
      >
        <MobileModalMenu
          onCartOpenClick={() => {
            setCartOpen(true);
            setMobileMenuOpen(false);
          }}
        />
      </ModalWrapper>
    </>
  );
};
export default NavBar;
