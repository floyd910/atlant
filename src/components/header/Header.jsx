import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
const Header = () => {
  return (
    <div className="header">
      <div className="brand_logo">
        <Link to="/" className="link">
          <img
            src="https://res.cloudinary.com/dvngcbhqt/image/upload/v1776800353/WhatsApp_Image_2026-04-21_at_11.48.27-removebg-preview_auedbz.png"
            alt="Atlant Logistics"
            className="logo-img"
          />
        </Link>
      </div>
      <div className="flex">
        <Link className="link" to="/">
          Home
        </Link>

        <Link className="link" to="about">
          About Us
        </Link>

        <Link className="link" to="/contact">
          Contact
        </Link>
      </div>
    </div>
  );
};

export default Header;
