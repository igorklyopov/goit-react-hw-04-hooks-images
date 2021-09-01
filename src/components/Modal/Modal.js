import { useEffect } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { StyledOverlay, StyledModal } from "./StyledModal";

const modalRoot = document.getElementById("modal-root");

function Modal({ children, onModalClose }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        console.log("onKeyDown");
        onModalClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown); //function cleanup
  }, [onModalClose]);

  const onBackdropClick = (e) => {
    if (e.currentTarget === e.target) {
      onModalClose();
    }
  };

  return createPortal(
    <StyledOverlay onClick={onBackdropClick}>
      <StyledModal>{children}</StyledModal>
    </StyledOverlay>,
    modalRoot
  );
}

Modal.propTypes = {
  children: PropTypes.node,
  onModalClose: PropTypes.func.isRequired,
};

export default Modal;
