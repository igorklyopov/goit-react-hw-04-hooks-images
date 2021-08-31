import { Component } from "react";
import { createPortal } from "react-dom";
import { StyledOverlay, StyledModal } from "./StyledModal";

const modalRoot = document.getElementById("modal-root");

class Modal extends Component {
  componentDidMount() {
    window.addEventListener("keydown", this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onKeyDown);
  }

  onKeyDown = (e) => {
    if (e.key === "Escape") {
      this.props.onModalClose();
    }
  };

  onBackdropClick = (e) => {
    if (e.currentTarget === e.target) {
      this.props.onModalClose();
    }
  };

  render() {
    return createPortal(
      <StyledOverlay onClick={this.onBackdropClick}>
        <StyledModal>{this.props.children}</StyledModal>
      </StyledOverlay>,
      modalRoot
    );
  }
}

export default Modal;
