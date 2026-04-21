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
        "https://res.cloudinary.com/dvngcbhqt/image/upload/v1776790063/2_About-ATLANT-LOGISTICS_gjywky.png",
      ),
      cld(
        "https://res.cloudinary.com/dvngcbhqt/image/upload/v1776790060/3_Our-Comprehensive-Services_cxlujx.png",
      ),
      cld(
        "https://res.cloudinary.com/dvngcbhqt/image/upload/v1776790043/4_Road-Transport-Solutions_bvtnto.png",
      ),
      cld(
        "https://res.cloudinary.com/dvngcbhqt/image/upload/v1776790055/5_Marine-Transport-Excellence_a2eo15.png",
      ),
      cld(
        "https://res.cloudinary.com/dvngcbhqt/image/upload/v1776790051/6_Cargo-Management-and-Tracking_tvg1oq.png",
      ),
      cld(
        "https://res.cloudinary.com/dvngcbhqt/image/upload/v1776790062/7_Geographic-Coverage_klmxzd.png",
      ),
      cld(
        "https://res.cloudinary.com/dvngcbhqt/image/upload/v1776790051/8_Why-Choose-ATLANT-LOGISTICS_iocder.png",
      ),
      cld(
        "https://res.cloudinary.com/dvngcbhqt/image/upload/v1776790060/9_Comprehensive-Cargo-Insurance_ongmn0.png",
      ),
      cld(
        "https://res.cloudinary.com/dvngcbhqt/image/upload/v1776790066/10_Ready-to-Streamline-Your-Logistics_hc9nsh.png",
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
    }, 9000);

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

      {/* 🔥 DOT SWITCHERS */}
      <div className="hero-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`hero-dot ${index === current ? "active" : ""}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>

      {loading && (
        <div className="overlay">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default HeroBg;
