import React, { useState } from "react";
import TransportType from "../../components/transportType/TransportType";
import { useParams } from "react-router-dom";
import "./Details.css";
import { IoIosMail } from "react-icons/io";
import { IoPhonePortrait } from "react-icons/io5";

const Details = ({ tour }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (img) => {
    setSelectedImage(img);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      {tour ? (
        <div className="tour_page page">
          <div className="tour_content">
            <h2 className="page_title tour_title">{tour.title}</h2>

            <img className="tour_cover" alt={tour.title} src={tour.cover} />
            <div
              className="tour_description"
              dangerouslySetInnerHTML={{ __html: tour.description }}
            />
            <h3 style={{ marginTop: "25px" }} className="subtitle">
              Gallery
            </h3>

            <div className="tour_gallery">
              {tour.images.map((img, index) => {
                return (
                  <img
                    key={index}
                    alt={tour.title}
                    src={img}
                    onClick={() => handleImageClick(img)}
                    className="gallery_image"
                    style={{ cursor: "pointer" }}
                  />
                );
              })}
            </div>
            <TransportType handleImageClick={handleImageClick} />
          </div>
          <div className="tour_extra">
            <div className="nearest_date">
              <p>Nearest date to be held:</p>
              <br />
              <span>03/05/25</span>
              <br />
              <br />
              <button>Join group</button>
              <br />
              <button className="book_privatly_btn">Book privatly</button>
              <br />
              <br />

              <a className="link see_all_dates_btn" href="#">
                See all dates
              </a>
            </div>
            <div className="contact_box">
              <button className="contact_box_mail contact_box_btn">
                <IoIosMail color="white" size="17px" />
                <span>pingeorgiatours@gmail.com</span>
              </button>
              <button className="contact_box_mobile contact_box_btn">
                <IoPhonePortrait color="black" size="16px" />
                <span>+995 555 242 266</span>
              </button>
            </div>
            <div className="tour_categories">
              <h2>{tour.title}:</h2>
              {tour.categories.map((cat, index) => {
                return <h3 key={cat}>{cat}</h3>;
              })}
            </div>
            <br />
            <a
              className="link"
              target="_blank"
              href="https://docs.google.com/document/d/1fCm_k91J6hwwekYXjqkt671omTJ3OajeeWwchxb-z2o/edit?usp=sharing"
            >
              See this tour in Google Docs
            </a>
            <div className="tour_map">
              {tour.map && tour.map.length > 0 ? (
                <iframe width="100%" height="400px" src={tour.map}></iframe>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {selectedImage && (
        <div className="image_modal" onClick={closeModal}>
          <button>x</button>
          <img src={selectedImage} alt="Full Size" className="modal_image" />
        </div>
      )}
    </>
  );
};

export default Details;
