import React, { useState, useEffect } from "react";
import { theme, StyledErrorMessage } from "../../StyledCommon";
import StyledApp from "./StyledApp";
import Container from "../Container";
import Searchbar from "../Searchbar";
import SearchForm from "../SearchForm";
import Section from "../Section";
import ImageGallery from "../ImageGallery";
import Button from "../Button";
import { IMAGES_PER_PAGE, fetchImages } from "../../services/fetchImages";
import showGalleryLoader from "../../utils/showGalleryLoader";
import scrollDown from "../../utils/scrollDown";

const Status = {
  IDLE: "idle",
  PENDING: "pending",
  RESOLVED: "resolved",
  REJECTED: "rejected",
};

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [images, setImages] = useState([]);
  const [moreImagesPerPage, setMoreImagesPerPage] = useState(false);
  const [status, setStatus] = useState(Status.IDLE);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchQuery !== "") getImages(searchQuery, pageNumber);
  }, [searchQuery, pageNumber]);

  const getImages = (searchQuery, pageNumber) => {
    fetchImages(searchQuery, pageNumber)
      .then((images) => {
        setImages((prevImages) => [...prevImages, ...images.hits]);
        setStatus(Status.RESOLVED);

        if (images.total === 0) {
          setStatus(Status.REJECTED);
          setError("No images for this request!");

          return;
        }

        images.total > IMAGES_PER_PAGE
          ? setMoreImagesPerPage(true)
          : setMoreImagesPerPage(false);

        if (pageNumber > 1) {
          scrollDown();
        }
      })
      .catch((error) => {
        setError(error.message);
        setStatus(Status.REJECTED);
      });
  };

  const onSearchFormSubmit = (searchQuery) => {
    setSearchQuery(searchQuery);
    setImages([]);
    setPageNumber(1);

    if (searchQuery === "") {
      setStatus(Status.REJECTED);
      setError("Please enter your request!");
    }
  };

  const onLoadMoreBtnClick = () => {
    setStatus(Status.PENDING);
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };

  return (
    <StyledApp>
      <Searchbar>
        <SearchForm getFormData={onSearchFormSubmit} />
      </Searchbar>
      <Section theme={theme}>
        <Container>
          {status === "pending" && showGalleryLoader()}
          {status === "rejected" && (
            <StyledErrorMessage>{error}</StyledErrorMessage>
          )}
          {status === "resolved" && (
            <>
              <ImageGallery images={images} />
              {moreImagesPerPage && (
                <Button
                  label="Load more"
                  onLoadMoreBtnClick={onLoadMoreBtnClick}
                />
              )}
            </>
          )}
        </Container>
      </Section>
    </StyledApp>
  );
}

export default App;
