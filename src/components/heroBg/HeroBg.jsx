import React, { useEffect, useMemo, useRef, useState } from "react";
import "./HeroBg.css";
import Loader from "../loader/Loader";
import Header from "../header/Header";

const cld = (url, w = 1920) =>
  url.replace("/upload/", `/upload/f_auto,q_auto,w_${w},dpr_auto/`);

const HeroBg = ({ loading, setLoading }) => {
  // 🔥 slides (replace URLs later)
  const slides = useMemo(
    () => [
      cld(
        "https://res.cloudinary.com/dvngcbhqt/image/upload/v1776704400/Gemini_Generated_Image_dywat6dywat6dywa_2_d01wll.png",
      ),
      cld(
        "https://res.cloudinary.com/dvngcbhqt/image/upload/v1776704400/Gemini_Generated_Image_dywat6dywat6dywa_1_p1wusy.png",
      ),
      cld(
        "https://res.cloudinary.com/dvngcbhqt/image/upload/v1776704390/Gemini_Generated_Image_dywat6dywat6dywa_3_hq4ahu.png",
      ),
      cld(
        "https://res.cloudinary.com/dvngcbhqt/image/upload/v1776704384/Gemini_Generated_Image_dywat6dywat6dywa_4_ogrir6.png",
      ),
    ],
    [],
  );

  const [current, setCurrent] = useState(0);
  const shownRef = useRef(false);

  // 🔥 preload first image (loader logic stays)
  useEffect(() => {
    shownRef.current = false;
    setLoading(true);

    const img = new Image();
    img.fetchPriority = "high";
    img.decoding = "async";

    const done = () => {
      if (shownRef.current) return;
      shownRef.current = true;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => setLoading(false));
      });
    };

    img.onload = done;
    img.onerror = done;
    img.src = slides[0];

    if (img.complete) done();

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [slides, setLoading]);

  // 🔥 slideshow interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000); // change speed here

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="hero-bg">
      {/* 🔥 slides rendered */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`hero-slide ${index === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide})` }}
        />
      ))}

      {loading && (
        <div className="overlay">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default HeroBg;
