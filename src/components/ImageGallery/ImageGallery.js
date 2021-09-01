import { useState } from "react";
import PropTypes from "prop-types";
import StyledImageGallery from "./StyledImageGallery";
import ImageGalleryItem from "../ImageGalleryItem/ImageGalleryItem";
import Modal from "../Modal/Modal";
import StyledImageModal from "../Modal/StyledImageModal";

function ImageGallery({ images }) {
  const [showModal, setShowModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const showLightBox = (index) => {
    setActiveImageIndex(index);
    toggleModal();
  };

  return (
    <>
      <StyledImageGallery>
        {images.map((image, index) => (
          <ImageGalleryItem
            key={image.id}
            imagesData={image}
            onClick={() => showLightBox(index)}
          />
        ))}
      </StyledImageGallery>
      {showModal && (
        <Modal onModalClose={toggleModal}>
          <StyledImageModal
            src={images[activeImageIndex].largeImageURL}
            alt={images[activeImageIndex].tags}
          />
        </Modal>
      )}
    </>
  );
}

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      webformatURL: PropTypes.string.isRequired,
      largeImageURL: PropTypes.string.isRequired,
    })
  ),
};

export default ImageGallery;
