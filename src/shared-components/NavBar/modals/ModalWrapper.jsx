import { RemoveScroll } from "react-remove-scroll";
import { useRef } from "react";
const ModalWrapper = (props) => {
  const { children, isOpen, onCloseClick } = props;
  const backgroundDivRef = useRef();

  if (!isOpen) {
    return null;
  }
  return (
    <RemoveScroll>
      <div
        ref={backgroundDivRef}
        className="fixed top-0 left-0 w-full h-full bg-black/30 backdrop-blur-sm flex justify-end items-start"
        onClick={(e) => {
          if (e.target === backgroundDivRef.current) {
            onCloseClick();
          }
        }}
      >
        <button
          className="absolute top-0 right-0 p-2  text-emerald-500 hover:text-emerald-700  "
          onClick={onCloseClick}
        >
          <i className="text-2xl fa-solid fa-circle-xmark "></i>
        </button>
        {children}
      </div>
    </RemoveScroll>
  );
};
export default ModalWrapper;
