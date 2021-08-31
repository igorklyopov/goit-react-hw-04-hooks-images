import PropTypes from "prop-types";
import { StyledIconButton } from "./StyledIconButton";

const IconButton = ({ children, type, ariaLabel, onClick }) => {
  return (
    <StyledIconButton type={type} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </StyledIconButton>
  );
};

IconButton.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  children: PropTypes.node,
  type: PropTypes.string.isRequired,
};
export default IconButton;
