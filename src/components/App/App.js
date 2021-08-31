import React, { Component } from "react";
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

class App extends Component {
  state = {
    searchQuery: "",
    pageNumber: 1,
    images: [],
    moreImagesPerPage: false,
    status: Status.IDLE,
    error: null,
  };

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery, pageNumber } = this.state;

    if (
      prevState.searchQuery !== this.state.searchQuery &&
      this.state.searchQuery !== ""
    ) {
      this.setState({ status: Status.PENDING, pageNumber: 1 });

      this.getImages(searchQuery, pageNumber);
    }
  }

  getImages = (searchQuery, pageNumber) => {
    fetchImages(searchQuery, pageNumber)
      .then((images) => {
        this.setState({ images: images.hits, status: Status.RESOLVED });

        if (images.total === 0) {
          this.setState({
            status: Status.REJECTED,
            error: "No images for this request!",
          });
          return;
        }

        images.total > IMAGES_PER_PAGE
          ? this.setState({ moreImagesPerPage: true })
          : this.setState({ moreImagesPerPage: false });

        if (pageNumber > 1) {
          scrollDown();
        }
      })
      .catch((error) =>
        this.setState({ error: error.message, status: Status.REJECTED })
      );
  };

  onSearchFormSubmit = (searchQuery) => {
    this.setState({ searchQuery, pageNumber: 1 });

    if (searchQuery === "") {
      this.setState({
        status: Status.REJECTED,
        error: "Please enter your request!",
      });
    }
  };

  onLoadMoreBtnClick = () => {
    const { searchQuery, pageNumber } = this.state;

    this.setState({
      status: Status.PENDING,
      pageNumber: pageNumber + 1,
    });
    this.getImages(searchQuery, pageNumber + 1);
  };

  render() {
    const { images, moreImagesPerPage, status, error } = this.state;

    return (
      <StyledApp>
        <Searchbar>
          <SearchForm getFormData={this.onSearchFormSubmit} />
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
                    onLoadMoreBtnClick={this.onLoadMoreBtnClick}
                  />
                )}
              </>
            )}
          </Container>
        </Section>
      </StyledApp>
    );
  }
}

export default App;
