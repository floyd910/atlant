import React, { useMemo, useRef, useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import "./Carousel.css";
import Loader from "../loader/Loader";

const cld = (url, w = 1920) =>
  url.replace("/upload/", `/upload/f_auto,q_auto,w_${w},dpr_auto/`);

const HeroCarousel = ({ loading, setLoading }) => {
  const slides = useMemo(
    () => [
      {
        img: cld(
          "https://res.cloudinary.com/dgcq1oqfg/image/upload/v1704893295/DSCF9647_ljlauh.jpg",
          1920,
        ),
      },
      // {
      //   img: cld(
      //     "https://res.cloudinary.com/dgcq1oqfg/image/upload/v1704893296/ZNPH8471-2_omj5it.jpg",
      //     1920
      //   ),
      // },
      // {
      //   img: cld(
      //     "https://res.cloudinary.com/dgcq1oqfg/image/upload/v1704893297/3_tdyw6k.jpg",
      //     1920
      //   ),
      // },
    ],
    [],
  );

  // track first real img element load (the one actually displayed)
  const firstShownRef = useRef(false);

  // make sure we start in loading state on mount / slides change
  useEffect(() => {
    firstShownRef.current = false;
    setLoading(true);
  }, [slides, setLoading]);

  // if browser cached it and it's already complete before onLoad fires
  useEffect(() => {
    const t = setTimeout(() => {
      const el = document.querySelector(
        ".carousel-container img[data-first='1']",
      );
      if (el && el.complete && !firstShownRef.current) {
        firstShownRef.current = true;
        setLoading(false);
      }
    }, 0);
    return () => clearTimeout(t);
  }, [slides, setLoading]);

  const handleFirstImageReady = () => {
    if (firstShownRef.current) return;
    firstShownRef.current = true;

    // ensure it paints at least one frame before removing overlay
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setLoading(false));
    });
  };

  return (
    <div className="carousel-container" style={{ position: "relative" }}>
      {/* ALWAYS render carousel so there is never a blank/white swap */}
      <Carousel
        showArrows
        showThumbs={false}
        showStatus={false}
        showIndicators={false}
        autoPlay
        infiniteLoop
        interval={3000}
        stopOnHover
        swipeable
        preventMovementUntilSwipeScrollTolerance
        swipeScrollTolerance={100}
      >
        {slides.map((slide, index) => (
          <div key={index} className={`slide slide_${index + 1}`}>
            <img
              src={slide.img}
              alt=""
              data-first={index === 0 ? "1" : "0"}
              onLoad={index === 0 ? handleFirstImageReady : undefined}
              onError={index === 0 ? handleFirstImageReady : undefined}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "low"}
              decoding="async"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </Carousel>

      {/* overlay stays until first image is REALLY loaded + painted */}
      {loading && (
        <div className="overlay">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
